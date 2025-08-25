import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}

  async findAll() {
    return this.authRepository.find();
  }

  async findOne(id: number) {
    return this.authRepository.findOne({ where: { id } });
  }

  async checkDatabaseConnection() {
    try {
      const count = await this.authRepository.count();
      return { connected: true, userCount: count };
    } catch (e) {
      return { connected: false, error: e.message };
    }
  }
}
