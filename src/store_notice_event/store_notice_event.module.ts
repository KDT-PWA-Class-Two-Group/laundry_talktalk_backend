import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreNoticeEvent } from './entities/store_notice_event.entity';
import { StoreNoticeEventService } from './store_notice_event.service';
import { StoreNoticeEventController } from './store_notice_event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoreNoticeEvent])],
  providers: [StoreNoticeEventService],
  controllers: [StoreNoticeEventController],
})
export class StoreNoticeEventModule {}
