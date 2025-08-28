import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./entities/store.entity";
import { StoresController } from "./stores.controller";
import { StoresService } from "./stores.service";
import { Machine } from "../machine/entities/machine.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Store, Machine])],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService]
})
export class StoresModule {}
