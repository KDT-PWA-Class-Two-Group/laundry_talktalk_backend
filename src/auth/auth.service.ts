import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { MailService } from '../auth/mail/mail.service';
import { FindIdDto } from './dto/find-id.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ 아이디 중복 체크
  async checkId(userId: string) {
    const exists = await this.authRepository.exists({ where: { loginId: userId } });
    return { isAvailable: !exists };
  }

  // ✅ 회원가입
  async signup(dto: SignUpDto) {
    try {
      // 1. 비밀번호 확인 검증
      if (dto.password !== dto.passwordConfirm) {
        throw new BadRequestException('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      }

      // 2. 입력값 유효성 추가 검증
      if (!dto.userId || !dto.password || !dto.email) {
        throw new BadRequestException('필수 입력 항목이 누락되었습니다.');
      }

      // 3. 이메일 형식 검증 (추가 보안)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email)) {
        throw new BadRequestException('올바른 이메일 형식이 아닙니다.');
      }

      // 4. 비밀번호 강도 검증 (선택적)
      if (dto.password.length < 4) {
        throw new BadRequestException('비밀번호는 최소 4자 이상이어야 합니다.');
      }

      // 5. 중복 검사
      const idExists = await this.authRepository.exists({ where: { loginId: dto.userId } });
      const emailExists = await this.authRepository.exists({ where: { email: dto.email } });

      if (idExists) throw new ConflictException('이미 사용중인 아이디입니다.');
      if (emailExists) throw new ConflictException('이미 사용중인 이메일입니다.');

      // 6. 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 7. 사용자 생성
      const user = this.authRepository.create({
        loginId: dto.userId,
        email: dto.email,
        passwordHash: hashedPassword,
        phone: dto.phone,
        // resetToken과 resetTokenExpiresAt은 기본값 null로 자동 설정됨
      });

      // 8. 사용자 저장
      await this.authRepository.save(user);

      return {
        message: '회원가입이 완료되었습니다.',
        userId: dto.userId,
        email: dto.email,
      };

    } catch (error) {
      // 이미 처리된 NestJS 예외들은 그대로 throw
      if (error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }

      // 예상치 못한 데이터베이스 에러 등
      console.error('회원가입 중 오류 발생:', error);
      throw new BadRequestException('회원가입 처리 중 오류가 발생했습니다.');
    }
  }

  // ✅ 로그인 (userId 기반으로 수정됨)
  async login(dto: SignInDto) {
    const user = await this.authRepository.findOne({
      where: { loginId: dto.userId },
      select: ['id', 'loginId', 'email', 'passwordHash'],
    });

    if (!user) throw new UnauthorizedException('존재하지 않는 아이디입니다.');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const payload = { sub: user.id, loginId: user.loginId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d', // ✅ 수정됨
    });

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await this.authRepository.save(user);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      email: user.email,
    };
  }


  // ✅ 아이디 찾기
  async findId(dto: FindIdDto) {
    const user = await this.authRepository.findOne({
      where: { email: dto.email, phone: dto.phone },
    });
    if (!user) throw new NotFoundException('일치하는 회원이 없습니다.');
    return { userId: user.loginId };
  }

  // ✅ 비밀번호 재설정 요청 (토큰 발급 + 메일 발송)
  async sendResetPasswordMail(email: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('가입된 이메일이 없습니다.');

    const token = crypto.randomBytes(32).toString('hex');
    const expire = new Date(Date.now() + 1000 * 60 * 30); // 30분 유효

    user.resetToken = token;
    user.resetTokenExpiresAt = expire;
    await this.authRepository.save(user);

    await this.mailService.sendResetPasswordMail(user.email, token);

    return { message: '비밀번호 재설정 메일이 발송되었습니다.' };
  }

  // ✅ 비밀번호 재설정
  async resetPassword(token: string, newPassword: string) {
    const user = await this.authRepository.findOne({ where: { resetToken: token } });
    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다.');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await this.authRepository.save(user);

    return { message: '비밀번호가 재설정되었습니다.' };
  }


  // ✅ 리프레시 토큰
  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('refreshToken이 필요합니다.');
    // TODO: 토큰 검증 후 새로운 accessToken 발급
    return { accessToken: 'new.jwt.token' };
  }

  // ✅ 회원탈퇴
  async withdrawal(body: { userId: string; password: string; passwordConfirm: string }) {
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestException('비밀번호 확인이 일치하지 않습니다.');
    }

    const user = await this.authRepository.findOne({ where: { loginId: body.userId }, select: ['id', 'passwordHash'] });
    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');

    const isMatch = await bcrypt.compare(body.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');

    await this.authRepository.remove(user);
    return { message: '회원탈퇴가 완료되었습니다.' };
  }

  // ✅ 프로필 수정
  async updateProfile(userId: number, dto: UpdateAuthDto) {
    const user = await this.authRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');

    if (dto.email) user.email = dto.email;
    if (dto.phone) user.phone = dto.phone;
    if (dto.newPassword) user.passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.authRepository.save(user);
    return { message: '프로필이 수정되었습니다.' };
  }

  // ✅ 기존 비밀번호 확인
  async verifyPassword(userId: number, password: string) {
    const user = await this.authRepository.findOne({ where: { id: userId }, select: ['id', 'passwordHash'] });
    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    return { isVerified: isMatch };
  }
}
