import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';   // ✅ 꼭 import
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { FavStore } from './entities/fav-store.entity';
import { Store } from '../stores/entities/store.entity';
import { MailModule } from '../auth/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, FavStore, Store]),
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // ✅ 환경변수 기반
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES || '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule, JwtModule],
})
export class AuthModule {}
