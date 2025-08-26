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
import { UserFavoritesService } from './user-favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('users/me/favorites/stores')
export class UserFavoritesController {
  constructor(private readonly favoritesService: UserFavoritesService) {}

  // 📌 애착매장 목록 조회
  @Get()
  async list(@Req() req: any) {
    const uid = 1; // TODO: JWT에서 req.user.id 추출
    return this.favoritesService.listFavorites(uid);
  }

  // 📌 애착매장 추가
  @Post()
  async add(@Req() req: any, @Body() dto: CreateFavoriteDto) {
    const uid = 1;
    return this.favoritesService.addFavorite(uid, dto.storeId);
  }

  // 📌 애착매장 삭제
  @Delete(':storeId')
  async remove(@Req() req: any, @Param('storeId', ParseIntPipe) storeId: number) {
    const uid = 1;
    return this.favoritesService.removeFavorite(uid, storeId);
  }
}
