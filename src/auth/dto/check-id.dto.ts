import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CheckIdDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '아이디는 영문/숫자/밑줄(_)만 가능합니다.',
  })
  loginId: string;
}
