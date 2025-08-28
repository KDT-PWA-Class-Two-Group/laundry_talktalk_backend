import { IsNumber, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class OptionIdDto {
  @IsNumber()
  optionId: number;
}

export class CalculateEstimateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionIdDto)
  options: OptionIdDto[];
}
