import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { FavStore } from '../../auth/entities/fav-store.entity';
import { MachineOptions } from '../../machine/entities/machine-options.entity';
import { Machine } from '../../machine/entities/machine.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Review } from '../../reviews/entities/review.entity';
import { ReviewComment } from '../../reviews/entities/review_comment.entity';
import { StoreNoticeEvent } from '../../store_notice_event/entities/store_notice_event.entity';
import { Store } from '../../stores/entities/store.entity';
import { SeedService } from './seed.service';

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
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Auth,
      Store,
      FavStore,
      MachineOptions,
      Machine,
      Reservation,
      Review,
      ReviewComment,
      StoreNoticeEvent,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
