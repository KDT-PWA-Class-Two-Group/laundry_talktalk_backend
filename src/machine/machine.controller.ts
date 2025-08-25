import { Controller } from "@nestjs/common";
import { MachineService } from "./machine.service";
//import { UpdateMachineOptionsDto } from "./dto/update-machine-options.dto";

@Controller("machine")
export class MachineController {
  constructor(private readonly machineService: MachineService) {}
}
