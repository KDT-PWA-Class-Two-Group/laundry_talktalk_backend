import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { FavStore } from './entities/fav-store.entity';
import { Store } from '../stores/entities/store.entity';
import { MailModule } from '../auth/mail/mail.module'; // ✅ 추가

@Module({
  imports: [TypeOrmModule.forFeature([Auth, FavStore, Store]), MailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule],
})
export class AuthModule {}
