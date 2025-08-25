import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { StoresModule } from "./stores/stores.module";
import { MachineModule } from "./machine/machine.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "1234",
      database: process.env.DB_DATABASE || "laundry_talktalk",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/migrations/*{.ts,.js}"],
      synchronize: false, // 프로덕션에서는 false, 마이그레이션 사용
      migrationsRun: true // 앱 시작시 자동으로 마이그레이션 실행
    }),
    AuthModule,
    StoresModule,
    MachineModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
