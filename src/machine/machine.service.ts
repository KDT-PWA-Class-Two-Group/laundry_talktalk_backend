import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { MachineOption } from "./entities/machine_options.entity";
import { UpdateMachineOptionsDto } from "./dto/update-machine-options.dto";
import { EstimateResponseDto } from "./dto/estimate-responce.dto";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { Machine } from "./entities/machine.entity";

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
    @InjectRepository(MachineOption)
    private readonly machineOptionRepository: Repository<MachineOption>,
    private readonly dataSource: DataSource
  ) {}

  async createMachine(createMachineDto: CreateMachineDto): Promise<Machine> {
    const { storeId, machineType } = createMachineDto;

    // TODO: 매장이 실제로 존재하는지 확인하는 로직을 추가하면 더 안정적인 코드가 됩니다.
    // (예: StoreRepository 주입 후 findOneOrFail 사용)

    // DTO의 machineType ('washer' | 'dryer')을 Entity의 boolean 타입으로 변환합니다.
    const isWasher = machineType === "washer";

    const newMachine = this.machineRepository.create({
      store_id2: storeId,
      // machine_name은 Machine 엔티티에 존재하지 않으므로 생성 객체에서 제외합니다.
      // admin_id는 엔티티에 있지만 DTO에 없으므로, 필요하다면 추가해야 합니다.
      machine_type: isWasher
    });

    return this.machineRepository.save(newMachine);
  }

  async updateMachineOptions(data: UpdateMachineOptionsDto): Promise<void> {
    const { machineId, storeId, options } = data;

    // 1. 기기와 매장이 존재하는지, 서로 일치하는지 확인
    const machine = await this.machineRepository.findOne({
      where: { machine_id: machineId, store_id2: storeId }
    });

    if (!machine) {
      throw new NotFoundException(
        `Machine with ID ${machineId} in store ${storeId} not found.`
      );
    }

    // 2. 트랜잭션을 사용하여 모든 옵션을 한 번에 업데이트 (원자성 보장)
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      for (const option of options) {
        const result = await transactionalEntityManager.update(
          MachineOption,
          {
            options_id: option.optionId,
            machine_id: machineId // 옵션이 해당 기기에 속하는지 확인
          },
          {
            options_base_price: String(option.price),
            options_base_time: String(option.durationMinutes)
          }
        );

        // 업데이트가 실제로 이루어졌는지 확인
        if (result.affected === 0) {
          throw new NotFoundException(
            `Option with ID ${option.optionId} for machine ${machineId} not found.`
          );
        }
      }
    });
  }

  calculateEstimatedCost(data: UpdateMachineOptionsDto): EstimateResponseDto {
    const { options } = data;

    const totalCost = options.reduce((sum, option) => sum + option.price, 0);
    const totalDuration = options.reduce(
      (sum, option) => sum + option.durationMinutes,
      0
    );

    return { totalCost, totalDuration };
  }
}
