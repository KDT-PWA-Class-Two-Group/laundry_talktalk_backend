import { Module } from "@nestjs/common";
import { MachineService } from "./machine.service";
import { MachineController } from "./machine.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Machine } from "./entities/machine.entity";
import { MachineOptions } from "./entities/machine-options.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Machine, MachineOptions])],
  controllers: [MachineController],
  providers: [MachineService]
})
export class MachineModule {}
