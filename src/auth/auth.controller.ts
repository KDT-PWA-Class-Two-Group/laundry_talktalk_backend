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
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { CheckIdDto } from './dto/check-id.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 아이디 중복 확인
  @Get('check-id/:userId')
  checkId(@Param('userId') userId: string) {
    return this.authService.checkId(userId);
  }

  // 회원가입
  @Post('sign-up')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  // 로그인
  @Post('login')   // ✅ 명세에 맞춤
  login(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }
}
