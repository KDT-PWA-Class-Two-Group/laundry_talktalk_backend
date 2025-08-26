import { Test, TestingModule } from "@nestjs/testing";
import { MachineController } from "./machine.controller";
import { MachineService } from "./machine.service";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { UpdateMachineOptionsDto } from "./dto/update-machine-options.dto";

describe("MachineController", () => {
  let controller: MachineController;

  // MachineService의 메서드들을 모의(mock) 함수로 만듭니다.
  const mockMachineService = {
    createMachine: jest.fn(),
    updateMachineOptions: jest.fn(),
    calculateEstimatedCost: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineController],
      // 실제 MachineService 대신 모의 서비스를 주입합니다.
      providers: [
        {
          provide: MachineService,
          useValue: mockMachineService
        }
      ]
    }).compile();

    controller = module.get<MachineController>(MachineController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createMachine", () => {
    it("요청이 들어오면 machineService.createMachine을 올바른 데이터와 함께 호출해야 합니다.", async () => {
      // 1. 준비 (Arrange): 테스트에 사용할 가짜 데이터를 만듭니다.
      const dto: CreateMachineDto = {
        storeId: 1,
        machineName: "1번 세탁기",
        machineType: "washer"
      };
      // 서비스가 반환할 가짜 결과도 미리 정의합니다.
      const expectedResult = {
        machine_id: 1,
        store_id2: 1,
        admin_id: 1,
        machine_type: true
      };
      mockMachineService.createMachine.mockResolvedValue(expectedResult);

      // 2. 실행 (Act): 실제 테스트할 함수를 호출합니다.
      const result = await controller.createMachine(dto);

      // 3. 검증 (Assert): 함수가 예상대로 동작했는지 확인합니다.
      expect(mockMachineService.createMachine).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("updateOptions", () => {
    it("요청이 들어오면 machineService.updateMachineOptions를 호출하고 성공 메시지를 반환해야 합니다.", async () => {
      // 1. 준비 (Arrange)
      const dto: UpdateMachineOptionsDto = {
        storeId: 1,
        machineId: 1,
        options: [
          { optionId: 1, price: 5000, durationMinutes: 30 },
          { optionId: 2, price: 1000, durationMinutes: 10 }
        ]
      };
      const expectedResponse = {
        message: "정보가 성공적으로 수정되었습니다."
      };

      // 2. 실행 (Act)
      const result = await controller.updateOptions(dto);

      // 3. 검증 (Assert)
      // 서비스의 updateMachineOptions 메서드가 올바른 dto와 함께 호출되었는지 확인
      expect(mockMachineService.updateMachineOptions).toHaveBeenCalledWith(dto);
      // 컨트롤러가 예상된 응답 객체를 반환하는지 확인
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("getEstimate", () => {
    it("요청이 들어오면 machineService.calculateEstimatedCost를 호출하고 예상 비용과 시간을 반환해야 합니다.", () => {
      // 1. 준비 (Arrange)
      const dto: UpdateMachineOptionsDto = {
        storeId: 1,
        machineId: 1,
        options: [
          { optionId: 1, price: 5000, durationMinutes: 30 },
          { optionId: 2, price: 1000, durationMinutes: 10 }
        ]
      };
      const expectedResult = {
        totalCost: 6000,
        totalDuration: 40
      };
      mockMachineService.calculateEstimatedCost.mockReturnValue(expectedResult);

      // 2. 실행 (Act)
      const result = controller.getEstimate(dto);

      // 3. 검증 (Assert)
      expect(mockMachineService.calculateEstimatedCost).toHaveBeenCalledWith(
        dto
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
