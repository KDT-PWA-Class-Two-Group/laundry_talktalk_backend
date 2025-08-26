import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, EntityManager } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { MachineService } from "./machine.service";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { Machine } from "./entities/machine.entity";
import { MachineOption } from "./entities/machine_options.entity";
import { UpdateMachineOptionsDto } from "./dto/update-machine-options.dto";

const createMockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn()
});

type MockRepository = ReturnType<typeof createMockRepository>;

describe("MachineService", () => {
  let service: MachineService;
  let machineRepository: MockRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        MachineService,
        {
          provide: getRepositoryToken(Machine),
          useValue: createMockRepository()
        },
        {
          // MachineService가 의존하는 다른 Repository들도 모킹해줍니다.
          provide: getRepositoryToken(MachineOption),
          useValue: createMockRepository()
        },
        {
          // DataSource도 모킹해줍니다.
          provide: DataSource,
          useValue: {
            transaction: jest
              .fn()
              .mockImplementation(
                async (
                  callback: (entityManager: EntityManager) => Promise<void>
                ) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  await callback({
                    // The mock object only needs the methods used in the service
                    update: jest.fn().mockResolvedValue({ affected: 1 })
                  } as any);
                }
              )
          }
        }
      ]
    }).compile();

    service = module.get<MachineService>(MachineService);
    machineRepository = module.get<MockRepository>(getRepositoryToken(Machine));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // createMachine 메서드에 대한 테스트 스위트
  describe("createMachine", () => {
    it("세탁기(washer)를 성공적으로 생성해야 합니다.", async () => {
      // 1. 준비 (Arrange)
      const createDto: CreateMachineDto = {
        storeId: 1,
        machineName: "1번 세탁기", // DTO에는 있지만 현재 엔티티에는 없는 필드
        machineType: "washer"
      };

      const expectedEntityData = {
        store_id2: createDto.storeId,
        machine_type: true // "washer"가 true로 변환되었는지 확인
      };

      // Repository의 create와 save 메서드가 어떻게 동작할지 모의(mock)합니다.
      machineRepository.create.mockReturnValue(expectedEntityData);
      machineRepository.save.mockResolvedValue(expectedEntityData);

      // 2. 실행 (Act)
      await service.createMachine(createDto);

      // 3. 검증 (Assert)
      // create 메서드가 예상된 데이터로 호출되었는지 확인합니다.
      expect(machineRepository.create).toHaveBeenCalledWith(expectedEntityData);
      // save 메서드가 create에서 반환된 객체로 호출되었는지 확인합니다.
      expect(machineRepository.save).toHaveBeenCalledWith(expectedEntityData);
    });
  });

  describe("updateMachineOptions", () => {
    const dto: UpdateMachineOptionsDto = {
      storeId: 1,
      machineId: 1,
      options: [
        { optionId: 101, price: 5000, durationMinutes: 30 },
        { optionId: 102, price: 1000, durationMinutes: 10 }
      ]
    };
    const mockMachine = { machine_id: 1, store_id2: 1 } as Machine;

    it("기기 옵션을 성공적으로 업데이트해야 합니다.", async () => {
      // 1. 준비 (Arrange)
      // findOne이 유효한 기기를 반환하도록 설정
      machineRepository.findOne.mockResolvedValue(mockMachine);

      // 2. 실행 (Act)
      await service.updateMachineOptions(dto);

      // 3. 검증 (Assert)
      // 올바른 인자로 기기를 조회했는지 확인
      expect(machineRepository.findOne).toHaveBeenCalledWith({
        where: { machine_id: dto.machineId, store_id2: dto.storeId }
      });

      // 트랜잭션이 시작되었는지 확인
      const dataSource = module.get<DataSource>(DataSource);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(dataSource.transaction).toHaveBeenCalled();
    });

    it("기기를 찾을 수 없으면 NotFoundException을 던져야 합니다.", async () => {
      // 1. 준비 (Arrange)
      // findOne이 null을 반환하도록 설정하여 '기기 없음' 시나리오를 만듭니다.
      machineRepository.findOne.mockResolvedValue(null);

      // 2. 실행 및 3. 검증 (Act & Assert)
      // updateMachineOptions를 실행했을 때 NotFoundException이 발생하는지 확인합니다.
      await expect(service.updateMachineOptions(dto)).rejects.toThrow(
        new NotFoundException(
          `Machine with ID ${dto.machineId} in store ${dto.storeId} not found.`
        )
      );
    });
  });

  describe("calculateEstimatedCost", () => {
    it("주어진 옵션들의 총 비용과 총 시간을 정확하게 계산해야 합니다.", () => {
      // 1. 준비 (Arrange)
      const dto: UpdateMachineOptionsDto = {
        storeId: 1,
        machineId: 1,
        options: [
          { optionId: 1, price: 5000, durationMinutes: 30 },
          { optionId: 2, price: 1000, durationMinutes: 10 },
          { optionId: 3, price: 2500, durationMinutes: 15 }
        ]
      };

      // 2. 실행 (Act)
      const result = service.calculateEstimatedCost(dto);

      // 3. 검증 (Assert)
      expect(result).toEqual({
        totalCost: 8500,
        totalDuration: 55
      });
    });
  });
});
