import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FindIdDto } from './dto/find-id.dto';
import { FindPasswordDto } from './dto/find-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
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
  async login(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
  
    const result = await this.authService.login(dto);
    
    // 🍪 Access Token을 HttpOnly Cookie에 설정
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,        // XSS 공격 방지
      secure: false,         // 🔧 localhost 개발환경에서는 false
      sameSite: 'lax',       // 🔧 localhost에서는 'lax'가 더 안전
      maxAge: 60 * 60 * 1000, // 1시간 (밀리초)
    });

    // 🍪 Refresh Token을 HttpOnly Cookie에 설정
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,        // XSS 공격 방지
      secure: false,         // 🔧 localhost 개발환경에서는 false
      sameSite: 'lax',       // 🔧 localhost에서는 'lax'가 더 안전
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초)
    });

    // 토큰은 쿠키에 설정했으므로 응답에서 제외
    return {
      message: '로그인 성공',
      userId: result.userId,
      email: result.email,
    };
  }

  // ✅ 로그아웃
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // 🍪 쿠키 삭제
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return { message: '로그아웃 되었습니다.' };
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
  @Post('reset-password')
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

  // ✅ 사용자 인증 상태 확인
  @Get('verify-user')
  async verifyUser(@Req() req: Request) {
    try {
      // 쿠키에서 accessToken 추출
      const accessToken = req.cookies?.accessToken;
      
      if (!accessToken) {
        throw new UnauthorizedException('Access token not found');
      }

      // JWT 토큰 검증 및 사용자 정보 조회
      const userInfo = await this.authService.verifyAccessToken(accessToken);
      
      return {
        success: true,
        userId: userInfo.userId,
        email: userInfo.email
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
