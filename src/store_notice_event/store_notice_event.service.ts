import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreNoticeEvent } from './entities/store_notice_event.entity';
import { CreateStoreNoticeEventDto } from './dto/create-store_notice_event.dto';
import { UpdateStoreNoticeEventDto } from './dto/update-store_notice_event.dto';

@Injectable()
export class StoreNoticeEventService {
  constructor(
    @InjectRepository(StoreNoticeEvent)
    private readonly storeNoticeEventRepository: Repository<StoreNoticeEvent>,
  ) {}

  async create(dto: CreateStoreNoticeEventDto): Promise<StoreNoticeEvent> {
    const event = this.storeNoticeEventRepository.create(dto);
    return this.storeNoticeEventRepository.save(event);
  }

  async findAll(storeId: number, category?: string): Promise<StoreNoticeEvent[]> {
    const where: any = { store_id2: storeId };
    if (category) where.store_notice_event_type = category === 'NOTICE';
    return this.storeNoticeEventRepository.find({ where });
  }

  async findOne(id: number): Promise<StoreNoticeEvent | null> {
    return this.storeNoticeEventRepository.findOne({ where: { store_notice_event_id: id } });
  }

  async update(id: number, dto: UpdateStoreNoticeEventDto): Promise<StoreNoticeEvent | null> {
    await this.storeNoticeEventRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.storeNoticeEventRepository.delete(id);
  }
}
