import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  userId: string;   // API 명세: userId → DB: login_id

  @IsNotEmpty()
  @IsString()
  @Length(4, 30)    // 최소 길이를 4로 완화
  password: string; // DB: password (passwordHash로 매핑됨)

  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  passwordConfirm: string; // 비밀번호 확인

  @IsNotEmpty()
  @IsEmail()
  email: string;    // ERD: email

  @IsOptional()
  @IsPhoneNumber('KR')
  phone?: string;   // ERD: phone
}
