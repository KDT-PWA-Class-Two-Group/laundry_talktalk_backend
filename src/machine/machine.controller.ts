// src/controller/machine.controller.ts
import { Controller, Post, Body, HttpStatus, HttpCode } from "@nestjs/common";
import { MachineService } from "./machine.service";
import { UpdateMachineOptionsDto } from "./dto/update-machine-options.dto";
import { UpdateMachineOptionsResponseDto } from "./dto/update-option-responce.dto";
import { EstimateResponseDto } from "./dto/estimate-responce.dto";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { Machine } from "./entities/machine.entity";

@Controller("machine")
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 리소스 생성이므로 201 Created 상태 코드가 더 적합합니다.
  async createMachine(
    @Body() createMachineDto: CreateMachineDto
  ): Promise<Machine> {
    return this.machineService.createMachine(createMachineDto);
  }

  @Post("options")
  @HttpCode(HttpStatus.OK) // 200 OK 상태 코드 명시
  async updateOptions(
    @Body() data: UpdateMachineOptionsDto
  ): Promise<UpdateMachineOptionsResponseDto> {
    await this.machineService.updateMachineOptions(data);
    return {
      message: "정보가 성공적으로 수정되었습니다."
    };
  }

  @Post("estimate")
  @HttpCode(HttpStatus.OK) // 200 OK 상태 코드 명시
  getEstimate(@Body() data: UpdateMachineOptionsDto): EstimateResponseDto {
    return this.machineService.calculateEstimatedCost(data);
  }
}
