import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Auth) private readonly usersRepo: Repository<Auth>,
  ) {}

  async updateProfile(userId: number, dto: { newPassword?: string; email?: string; phone?: string }) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) return { message: 'not found' };

    if (dto.email) user.email = dto.email;
    if (dto.phone) user.phone = dto.phone;
    if (dto.newPassword) {
      // TODO: bcrypt.hash(dto.newPassword, salt)
      user.passwordHash = dto.newPassword;
    }

    await this.usersRepo.save(user);
    return { message: '정보가 성공적으로 수정되었습니다.' };
  }

  async verifyPassword(userId: number, password: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      select: ['id', 'passwordHash'],
    });
    if (!user) return { isVerified: false };

    // TODO: bcrypt.compare(password, user.passwordHash)
    return { isVerified: password === user.passwordHash };
  }
}
