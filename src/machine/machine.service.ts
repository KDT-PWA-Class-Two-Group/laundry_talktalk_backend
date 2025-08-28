import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, In } from "typeorm";
import { UpdateMachineOptionsDto } from "./dto/update-machine-options.dto";
import { EstimateResponseDto } from "./dto/estimate-responce.dto";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { Machine } from "./entities/machine.entity";
import { MachineResponseDto } from "./dto/machine-response.dto";
import { MachineOptions } from "./entities/machine-options.entity";
import { Store } from "src/stores/entities/store.entity";

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
    @InjectRepository(MachineOptions)
    private readonly machineOptionsRepository: Repository<MachineOptions>,
    @InjectRepository(Store) // Store 엔티티를 주입합니다.
    private readonly storeRepository: Repository<Store>,
    private readonly dataSource: DataSource
  ) {}

  async createMachine(
    createMachineDto: CreateMachineDto,
    userId: number
  ): Promise<MachineResponseDto> {
    const { storeId, machineType } = createMachineDto;

    const newMachine = this.machineRepository.create({
      store: { store_id: storeId },
      user: { id: userId },
      machine_type: machineType
    });

    const savedMachine = await this.machineRepository.save(newMachine);

    return {
      machineId: savedMachine.machine_id,
      storeId: savedMachine.store.store_id,
      machineName: `기계 #${savedMachine.machine_id}`,
      machineType: savedMachine.machine_type
    };
  }

  async updateMachineOptions(data: UpdateMachineOptionsDto): Promise<void> {
    const { machineId, storeId, options } = data;

    const machine = await this.machineRepository.findOne({
      where: { machine_id: machineId, store: { store_id: storeId } }
    });

    if (!machine) {
      throw new NotFoundException(
        `Machine with ID ${machineId} in store ${storeId} not found.`
      );
    }

    const optionIds = options.map((o) => o.optionId);
    const foundOptions = await this.machineOptionsRepository.findBy({
      options_id: In(optionIds)
    });

    if (foundOptions.length !== optionIds.length) {
      throw new NotFoundException(`One or more options not found.`);
    }

    machine.options = foundOptions;

    await this.machineRepository.save(machine);
  }

  /**
   * 프론트엔드에서 특정 기기에 대한 옵션 목록을 불러오는 함수
   */
  async getMachineOptions(
    storeId: number,
    machineId: number
  ): Promise<{
    courses: MachineOptions[];
    options: MachineOptions[];
    dryerTimes: MachineOptions[];
  }> {
    const machine = await this.machineRepository
      .createQueryBuilder("machine")
      .leftJoinAndSelect("machine.options", "options")
      .leftJoinAndSelect("machine.store", "store")
      .where("machine.machine_id = :machineId", { machineId })
      .andWhere("store.store_id = :storeId", { storeId })
      .getOne();

    if (!machine) {
      throw new NotFoundException("Machine not found for this store");
    }

    const courses = machine.options.filter(
      (opt) => opt.machine_type === true && opt.options_type === true
    );
    const additionalOptions = machine.options.filter(
      (opt) => opt.machine_type === true && opt.options_type === false
    );
    const dryerTimes = machine.options.filter(
      (opt) => opt.machine_type === false && opt.options_type === true
    );

    return { courses, options: additionalOptions, dryerTimes };
  }

  /**
   * 프론트엔드에서 보낸 선택된 옵션 목록으로 예상 비용 및 시간 계산
   */
  async calculateEstimate(
    optionsFromRequest: { optionId: number }[]
  ): Promise<EstimateResponseDto> {
    if (!optionsFromRequest || optionsFromRequest.length === 0) {
      return { totalCost: 0, totalDuration: 0 };
    }

    const optionIds = optionsFromRequest.map((o) => o.optionId);
    const foundOptions = await this.machineOptionsRepository.findBy({
      options_id: In(optionIds)
    });

    if (foundOptions.length !== optionIds.length) {
      throw new NotFoundException(`One or more options not found.`);
    }

    const totalCost = foundOptions.reduce(
      (sum, opt) => sum + Number(opt.options_base_price),
      0
    );
    const totalDuration = foundOptions.reduce(
      (sum, opt) => sum + Number(opt.options_base_time),
      0
    );

    return { totalCost, totalDuration };
  }
}
