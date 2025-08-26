import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}

  // 아이디 중복 체크
  async checkId(userId: string) {
    const exists = await this.authRepository.exists({ where: { loginId: userId } });
    return { isAvailable: !exists };
  }

  // 회원가입
  async signup(dto: SignUpDto) {
  const idExists = await this.authRepository.exists({ where: { loginId: dto.userId } });
  const emailExists = await this.authRepository.exists({ where: { email: dto.email } });

  if (idExists || emailExists) {
    throw new ConflictException('이미 사용중인 아이디 또는 이메일입니다.');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = this.authRepository.create({
    loginId: dto.userId,     // userId → loginId
    email: dto.email,
    passwordHash: hashedPassword,
    phone: dto.phone,
  });

  await this.authRepository.save(user);
  return { message: '회원가입이 완료되었습니다.' };
}


  // 로그인
  async login(dto: SignInDto) {
  const user = await this.authRepository.findOne({
    where: { email: dto.email }, // email 기반 로그인
    select: ['id', 'loginId', 'email', 'passwordHash'],
  });

  if (!user) throw new UnauthorizedException('존재하지 않는 이메일입니다.');

  const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

  return { accessToken: 'jwt.token.string', userId: user.id };
}

}