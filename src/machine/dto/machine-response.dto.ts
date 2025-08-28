import { IsBoolean, IsInt, IsString } from "class-validator";

export class MachineResponseDto {
  @IsInt()
  machineId: number;

  @IsInt()
  storeId: number;

  @IsString()
  machineName: string;

  @IsBoolean()
  machineType: boolean;
}
