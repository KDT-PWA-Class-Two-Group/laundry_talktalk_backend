import { IsString, IsNotEmpty, IsNumber, IsIn } from "class-validator";

export class CreateMachineDto {
  @IsNumber()
  @IsNotEmpty({ message: "매장 ID를 입력해주세요." })
  storeId: number;

  @IsString()
  @IsNotEmpty({ message: "기기 이름을 입력해주세요." })
  machineName: string;

  @IsString()
  @IsNotEmpty({ message: "기기 종류를 입력해주세요." })
  @IsIn(["washer", "dryer"], {
    message: '기기 종류는 "washer" 또는 "dryer" 여야 합니다.'
  })
  machineType: "washer" | "dryer";
}
