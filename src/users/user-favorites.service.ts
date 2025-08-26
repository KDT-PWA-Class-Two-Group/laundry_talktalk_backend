import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavStore } from '../auth/entities/fav-store.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Store } from '../stores/entities/store.entity';

@Injectable()
export class UserFavoritesService {
  constructor(
    @InjectRepository(FavStore) private readonly favRepo: Repository<FavStore>,
    @InjectRepository(Auth) private readonly usersRepo: Repository<Auth>,
    @InjectRepository(Store) private readonly storesRepo: Repository<Store>,
  ) {}

  // 📌 애착매장 목록 조회
  async listFavorites(userId: number) {
    const rows = await this.favRepo.find({
      where: { user: { id: userId }, favStoreCancel: false },
      relations: ['store'],
    });

    return rows.map((r) => ({
      storeId: r.store.store_id,
      name: r.store.store_name,
      address: r.store.store_address ?? '',
    }));
  }

  // 📌 애착매장 추가
  async addFavorite(userId: number, storeId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const store = await this.storesRepo.findOne({ where: { store_id: storeId } });

    if (!user || !store) return { message: 'invalid' };

    const exists = await this.favRepo.findOne({
      where: { user: { id: userId }, store: { store_id: store.store_id }, favStoreCancel: false },
    });
    if (exists) return { message: '이미 등록된 애착매장입니다.' };

    await this.favRepo.save(this.favRepo.create({ user, store }));
    return { message: '애착매장으로 등록되었습니다.' };
  }

  // 📌 애착매장 삭제
  async removeFavorite(userId: number, storeId: number) {
    const row = await this.favRepo.findOne({
      where: { user: { id: userId }, store: { store_id: storeId }, favStoreCancel: false },
      relations: ['store'],
    });

    if (!row) return { message: '이미 삭제되었거나 존재하지 않습니다.' };

    row.favStoreCancel = true;
    await this.favRepo.save(row);
    return { message: '애착매장에서 삭제되었습니다.' };
  }
}
