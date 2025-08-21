import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const auth = this.authRepository.create(createAuthDto);
    return await this.authRepository.save(auth);
  }

  async findAll() {
    return await this.authRepository.find();
  }

  async findOne(id: number) {
    return await this.authRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    await this.authRepository.update(id, updateAuthDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const auth = await this.findOne(id);
    if (auth) {
      return await this.authRepository.remove(auth);
    }
    return null;
  }

  // 데이터베이스 연결 상태 확인용 메서드
  async checkDatabaseConnection() {
    try {
      const count = await this.authRepository.count();
      return { 
        connected: true, 
        message: 'Database connection successful',
        authCount: count 
      };
    } catch (error) {
      return { 
        connected: false, 
        message: 'Database connection failed',
        error: error.message 
      };
    }
  }
}
