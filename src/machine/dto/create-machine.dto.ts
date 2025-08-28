import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreateMachineDto {
  @IsNumber()
  @IsNotEmpty({ message: "매장 ID를 입력해주세요." })
  storeId: number;

  @IsBoolean({ message: "기기 종류는 boolean 값(true/false)이어야 합니다." })
  @IsNotEmpty({ message: "기기 종류를 입력해주세요." })
  // true: 세탁기, false: 건조기
  machineType: boolean;
}
