import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddMachineOptionResponseDto {
  @IsNotEmpty()
  @IsInt()
  optionsId: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
