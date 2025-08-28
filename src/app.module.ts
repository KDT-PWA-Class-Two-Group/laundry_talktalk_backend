import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MachineModule } from './machine/machine.module';
import { ReservationModule } from './reservation/reservation.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StoreNoticeEventModule } from './store_notice_event/store_notice_event.module';
import { StoresModule } from './stores/stores.module';
import config from './typeorm.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(config),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'laundry-secret-key',
      signOptions: { expiresIn: '1h' },
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
