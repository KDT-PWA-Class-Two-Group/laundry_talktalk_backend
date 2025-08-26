//import { IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateMachineDto {
  storeId: number;
  userId: number;
  machineType: boolean;
}
