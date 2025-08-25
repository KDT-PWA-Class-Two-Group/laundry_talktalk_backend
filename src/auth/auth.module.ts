import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { FavStore } from './entities/fav-store.entity';
import { Store } from '../stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, FavStore, Store])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule], // users 모듈에서 레포 주입 가능
})
export class AuthModule {}
