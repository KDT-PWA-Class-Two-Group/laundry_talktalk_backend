import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  userId: string;   // API 명세: userId → DB: login_id

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string; // DB: password (passwordHash로 매핑됨)

  @IsNotEmpty()
  @IsEmail()
  email: string;    // ERD: email

  @IsOptional()
  @IsPhoneNumber('KR')
  phone?: string;   // ERD: phone
}
