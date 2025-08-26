import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFavoritesController } from './user-favorites.controller';
import { UserFavoritesService } from './user-favorites.service';
import { FavStore } from '../auth/entities/fav-store.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Store } from '../stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, FavStore, Store])],
  controllers: [UserFavoritesController],
  providers: [UserFavoritesService],
})
export class UsersModule {}
