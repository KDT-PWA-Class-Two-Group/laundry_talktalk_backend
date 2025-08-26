import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string; // 이메일로 전달된 재설정 토큰

  @IsNotEmpty()
  @IsString()
  @Length(8, 30, { message: '비밀번호는 8~30자여야 합니다.' })
  newPassword: string;
}
