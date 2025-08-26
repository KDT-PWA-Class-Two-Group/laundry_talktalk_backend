import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  loginId: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
