import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';

// DTO 정의
class LoginDto {
  email: string;
  password: string;
}
class SignupDto {
  loginId: string;   // ✅ userId → loginId 로 변경
  password: string;
  email: string;
  phone?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}

  // 아이디 중복 확인
  @Get('check-id/:loginId')
  async checkId(@Param('loginId') loginId: string) {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(loginId)) {
      throw new BadRequestException('아이디 형식이 올바르지 않습니다.');
    }
    const exists = await this.authRepo.exists({ where: { loginId } }); // ✅ loginId
    return { isAvailable: !exists };
  }

  // 회원가입
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const idExists = await this.authRepo.exists({ where: { loginId: dto.loginId } }); // ✅ loginId
    const emailExists = await this.authRepo.exists({ where: { email: dto.email } });

    if (idExists || emailExists) {
      throw new ConflictException('이미 사용중인 아이디 또는 이메일입니다.');
    }

    await this.authRepo.save(
      this.authRepo.create({
        loginId: dto.loginId,        // ✅ loginId
        email: dto.email,
        passwordHash: dto.password,  // TODO: bcrypt hash
        phone: dto.phone,
      }),
    );

    return { message: '회원가입이 완료되었습니다.' };
  }

  // 로그인
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'passwordHash', 'loginId'], // ✅ loginId
    });

    // TODO: bcrypt.compare(dto.password, user.passwordHash)
    if (!user || user.passwordHash !== dto.password) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    return { accessToken: 'jwt.token.string' }; // TODO: 실제 JWT 발급
  }
}
