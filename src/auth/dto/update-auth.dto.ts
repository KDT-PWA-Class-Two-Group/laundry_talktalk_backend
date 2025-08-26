import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateAuthDto {
  @IsOptional()
  @IsString()
  @Length(8, 30)
  newPassword?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('KR')
  phone?: string;
}
