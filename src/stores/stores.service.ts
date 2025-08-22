import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchStoreResponseDto } from './dto/search-store-response.dto';
import { StoreDetailResponseDto } from './dto/store-detail-response.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  // async create(createStoreDto: CreateStoreDto) {
  //   const store = this.storeRepository.create(createStoreDto);
  //   return await this.storeRepository.save(store);
  // }

  async findAll() {
    return await this.storeRepository.find();
  }


  // 매장 상세정보 조회
  async getStoreDetail(storeId: number): Promise<StoreDetailResponseDto> {
    const store = await this.storeRepository.findOne({ 
      where: { store_id: storeId },
      relations: ['admin']
    });

    if (!store) {
      throw new NotFoundException(`매장 ID ${storeId}를 찾을 수 없습니다.`);
    }

    return new StoreDetailResponseDto(store);
  }

  // 모든 매장 조회
  async getAllStores(): Promise<StoreDetailResponseDto[]> {
    const stores = await this.storeRepository.find({
      relations: ['admin'],
      order: { store_name: 'ASC' }
    });
    return stores.map(store => new StoreDetailResponseDto(store));
  }

  // 매장 삭제
  async remove(storeId: number): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { store_id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`매장 ID ${storeId}를 찾을 수 없습니다.`);
    }

    await this.storeRepository.remove(store);
  }

  // 키워드로 매장 검색 (페이지네이션 포함)
  async searchByKeyword(
    keyword: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<SearchStoreResponseDto> {
    const [stores, total] = await this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.admin', 'admin')
      .where(
        'store.store_name LIKE :keyword OR store.store_address LIKE :keyword',
        {
          keyword: `%${keyword}%`,
        },
      )
      .orderBy('store.store_name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: stores,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // 위치 기반 주변 매장 검색
  async searchNearbyStores(
    latitude: number,
    longitude: number,
    radius: number = 3,
  ): Promise<SearchStoreResponseDto> {
    const stores = await this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.admin', 'admin')
      .where(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(store.store_latitude)) * cos(radians(store.store_longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(store.store_latitude)))) <= :radius`,
        { lat: latitude, lng: longitude, radius },
      )
      .orderBy('store.store_name', 'ASC')
      .getMany();

    return {
      data: stores,
      meta: {
        total: stores.length,
        page: 1,
        limit: stores.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}
