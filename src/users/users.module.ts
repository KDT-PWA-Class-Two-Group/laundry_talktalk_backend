import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserFavoritesController } from './user-favorites.controller';
import { UsersService } from './users.service';
import { Auth as AuthEntity } from '../auth/entities/auth.entity';
import { FavStore } from '../auth/entities/fav-store.entity'; // 👈 users/entities 쪽으로 이동했으면 이렇게
import { Store } from '../stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity, FavStore, Store])],
  controllers: [UsersController, UserFavoritesController],
  providers: [UsersService], // 👈 자동생성된 service도 등록
  exports: [UsersService],   // 👈 필요하면 다른 모듈에서도 쓸 수 있게 export
})
export class UsersModule {}
