import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MachineModule } from './machine/machine.module';
import { ReservationModule } from './reservation/reservation.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StoreNoticeEventModule } from './store_notice_event/store_notice_event.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '192.168.100.139',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'laundry_talktalk',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // 프로덕션에서는 false, 마이그레이션 사용
    }),
    AuthModule,
    ReviewsModule,
    UsersModule,
    ReservationModule,
    MachineModule,
    StoreNoticeEventModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
