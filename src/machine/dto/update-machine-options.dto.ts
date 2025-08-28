import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export class OptionDto {
  @IsNotEmpty()
  @IsInt()
  optionId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsInt()
  durationMinutes: number;
}

export class UpdateMachineOptionsDto {
  @IsNotEmpty()
  @IsInt()
  storeId: number;

  @IsNotEmpty()
  @IsInt()
  machineId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}
