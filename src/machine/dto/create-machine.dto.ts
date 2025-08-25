//import { IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateMachineDto {
  storeId: number;
  adminId: number;
  machineType: boolean;
}
