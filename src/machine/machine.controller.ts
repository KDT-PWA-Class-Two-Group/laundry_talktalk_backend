import {
  Controller,
  Req,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Query
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MachineService } from "./machine.service";
import { UpdateMachineOptionsDto } from "./dto/update-machine-options.dto";
import { UpdateMachineOptionsResponseDto } from "./dto/update-option-responce.dto";
import { EstimateResponseDto } from "./dto/estimate-responce.dto";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { MachineResponseDto } from "./dto/machine-response.dto";
import { Auth } from "src/auth/entities/auth.entity";
import { CalculateEstimateDto } from "./dto/calculate-estimate.dto";

@Controller("machine")
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async createMachine(
    @Body() createMachineDto: CreateMachineDto,
    @Req() req: { user: Auth }
  ): Promise<MachineResponseDto> {
    const userId = req.user.id;
    return this.machineService.createMachine(createMachineDto, userId);
  }

  @Post("options")
  @HttpCode(HttpStatus.OK)
  async updateOptions(
    @Body() data: UpdateMachineOptionsDto
  ): Promise<UpdateMachineOptionsResponseDto> {
    await this.machineService.updateMachineOptions(data);
    return {
      message: "정보가 성공적으로 수정되었습니다."
    };
  }

  @Post("estimate")
  @HttpCode(HttpStatus.OK)
  async getEstimate(
    @Body() dto: CalculateEstimateDto
  ): Promise<EstimateResponseDto> {
    return this.machineService.calculateEstimate(dto.options);
  }

  // --- 새로 추가되는 엔드포인트 ---
  @Get("options")
  @HttpCode(HttpStatus.OK)
  async getMachineOptions(
    @Query("storeId") storeId: number,
    @Query("machineId") machineId: number
  ) {
    return this.machineService.getMachineOptions(storeId, machineId);
  }
}
