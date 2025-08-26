import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddMachineOptionDto {
  @IsNotEmpty()
  @IsInt()
  machineId: number;

  @IsNotEmpty()
  @IsString()
  optionsName: string;

  @IsNotEmpty()
  @IsString()
  optionsBaseTime: string;

  @IsNotEmpty()
  @IsString()
  optionsBasePrice: string;

  @IsNotEmpty()
  @IsString()
  optionsType: string;
}
