// src/machine/dto/machine-options.dto.ts
//import { IsNumber, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
//import { Type } from 'class-transformer';

export class OptionDto {
  option_id: number;
  price: number;
  durationMinutes: number;
}

export class UpdateMachineOptionsDto {
  storeId: number;
  machineId: number;
  options: OptionDto[];
}
