import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class FindIdDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phone: string;
}
