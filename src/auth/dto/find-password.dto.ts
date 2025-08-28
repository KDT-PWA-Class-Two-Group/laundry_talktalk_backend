import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
