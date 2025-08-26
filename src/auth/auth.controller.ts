import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { CheckIdDto } from './dto/check-id.dto';
import { FindIdDto } from './dto/find-id.dto';
import { FindPasswordDto } from './dto/find-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ 아이디 중복 확인
  @Get('check-id/:userId')
  checkId(@Param('userId') userId: string) {
    return this.authService.checkId(userId);
  }

  // ✅ 회원가입
  @Post('sign-up')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  // ✅ 로그인
  @Post('login')
  login(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  // ✅ 아이디 찾기
  @Post('find-id')
  findId(@Body() dto: FindIdDto) {
    return this.authService.findId(dto);
  }

  // ✅ 비밀번호 재설정 요청 (메일 발송)
  @Post('password/reset-request')
  resetRequest(@Body() dto: FindPasswordDto) {
    return this.authService.sendResetPasswordMail(dto.email);
  }

  // ✅ 비밀번호 재설정
  @Post('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  // ✅ 리프레시 토큰
  @Post('refresh-token')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // ✅ 회원탈퇴
  @Post('withdrawal')
  withdrawal(@Body() body: { userId: string; password: string; passwordConfirm: string }) {
    return this.authService.withdrawal(body);
  }

  // ✅ 프로필 수정
  @Put('profile')
  updateProfile(@Body() dto: UpdateAuthDto) {
    const userId = 1; // TODO: JWT에서 추출
    return this.authService.updateProfile(userId, dto);
  }

  // ✅ 기존 비밀번호 확인
  @Post('verify-password')
  verifyPassword(@Body('password') password: string) {
    const userId = 1; // TODO: JWT에서 추출
    return this.authService.verifyPassword(userId, password);
  }
}
