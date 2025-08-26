import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;    // API 명세: email → ERD: email

  @IsNotEmpty()
  @IsString()
  password: string; // API 명세 & ERD: password
}
