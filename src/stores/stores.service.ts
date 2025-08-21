import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';




@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const store = this.storeRepository.create(createStoreDto);
    return await this.storeRepository.save(store);
  }

  async findAll() {
    return await this.storeRepository.find();
  }

  async findOne(id: number) {
    return await this.storeRepository.findOne({ where: { store_id: id } });
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    await this.storeRepository.update(id, updateStoreDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const store = await this.findOne(id);
    if (store) {
      return await this.storeRepository.remove(store);
    }
    return null;
  }

  // 위치 기반 매장 검색
  async findByLocation(latitude: number, longitude: number, radius: number = 5) {
    return await this.storeRepository
      .createQueryBuilder('store')
      .where(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(store.store_latitude)) * cos(radians(store.store_longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(store.store_latitude)))) < :radius`,
        { lat: latitude, lng: longitude, radius }
      )
      .getMany();
  }

  // 평점별 매장 검색
  async findByScore(minScore: number = 0) {
    return await this.storeRepository
      .createQueryBuilder('store')
      .where('store.store_score >= :minScore', { minScore })
      .orderBy('store.store_score', 'DESC')
      .getMany();
  }

  // 매장명으로 검색
  async findByName(storeName: string) {
    return await this.storeRepository
      .createQueryBuilder('store')
      .where('store.store_name LIKE :name', { name: `%${storeName}%` })
      .getMany();
  }
}
