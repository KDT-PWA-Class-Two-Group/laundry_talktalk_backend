import { IsNumber, IsNotEmpty } from "class-validator";

export class EstimateResponseDto {
  @IsNotEmpty()
  @IsNumber()
  totalCost: number;

  @IsNotEmpty()
  @IsNumber()
  totalDuration: number;
}
