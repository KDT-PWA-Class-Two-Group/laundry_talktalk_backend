import { IsString, IsNotEmpty } from "class-validator";

export class UpdateMachineOptionsResponseDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
