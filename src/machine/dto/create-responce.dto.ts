import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateResponseDto {
  @IsNotEmpty()
  @IsInt()
  machineId: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
