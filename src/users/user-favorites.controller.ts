import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../auth/entities/auth.entity';
import { FavStore } from '../auth/entities/fav-store.entity';
import { Store } from '../stores/entities/store.entity';

class CreateFavoriteDto {
  storeId: number;
}

@Controller('users/me/favorites/stores')
export class UserFavoritesController {
  constructor(
    @InjectRepository(FavStore) private readonly favRepo: Repository<FavStore>,
    @InjectRepository(Auth) private readonly usersRepo: Repository<Auth>,
    @InjectRepository(Store) private readonly storesRepo: Repository<Store>,
  ) {}

  // 📌 애착매장 목록 조회
  @Get()
  async list(@Req() req: any) {
    const uid = 1; // TODO: JWT에서 req.user.id 추출
    const rows = await this.favRepo.find({
      where: { user: { id: uid }, favStoreCancel: false },
      relations: ['store'],
    });

    return rows.map((r) => ({
      storeId: r.store.store_id,
      name: r.store.store_name,
      address: r.store.store_address ?? '',
    }));
  }

  // 📌 애착매장 추가
  @Post()
  async add(@Req() req: any, @Body() dto: CreateFavoriteDto) {
    const uid = 1; // TODO: JWT에서 req.user.id 추출
    const user = await this.usersRepo.findOne({ where: { id: uid } });
    const store = await this.storesRepo.findOne({ where: { store_id: dto.storeId } });

    if (!user || !store) return { message: 'invalid' };

    const exists = await this.favRepo.findOne({
      where: { user: { id: uid }, store: { store_id: store.store_id }, favStoreCancel: false },
    });
    if (exists) return { message: '이미 등록된 애착매장입니다.' };

    await this.favRepo.save(this.favRepo.create({ user, store }));

    return { message: '애착매장으로 등록되었습니다.' };
  }

  // 📌 애착매장 삭제
  @Delete(':storeId')
  async remove(
    @Req() req: any,
    @Param('storeId', ParseIntPipe) storeId: number,
  ) {
    const uid = 1; // TODO: JWT에서 req.user.id 추출
    const row = await this.favRepo.findOne({
      where: { user: { id: uid }, store: { store_id: storeId }, favStoreCancel: false },
      relations: ['store'],
    });

    if (!row) return { message: '이미 삭제되었거나 존재하지 않습니다.' };

    row.favStoreCancel = true;
    await this.favRepo.save(row);

    return { message: '애착매장에서 삭제되었습니다.' };
  }
}
