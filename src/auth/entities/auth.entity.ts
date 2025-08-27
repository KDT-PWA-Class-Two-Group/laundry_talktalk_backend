import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { FavStore } from './fav-store.entity';

@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number; // PK

  @OneToMany(() => FavStore, (favStore) => favStore.user)
  favStores: FavStore[];

  // 🔑 로그인 아이디 (회원가입 시 필수)
  @Column({ name: 'login_id', type: 'varchar', length: 50, unique: true, nullable: false })
  loginId: string;

  // 🔑 이메일 (회원가입 시 필수)
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  // 🔑 비밀번호 해시
  @Exclude()
  @Column({ name: 'password', select: false })
  passwordHash: string;

  // 📞 전화번호 (선택)
  @Column({ nullable: true })
  phone?: string;

  @Column({ name: 'access_token', type: 'varchar', length: 500, nullable: true })
  accessToken?: string;

  @Column({ name: 'refresh_token', type: 'varchar', length: 500, nullable: true })
  refreshToken?: string;


  // 🔑 관리자 여부
  @Column({ name: 'user_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  // 🔑 비밀번호 재설정 토큰
  @Column({ name: 'reset_token', type: 'varchar', nullable: true })
  resetToken: string | null;

  // 🔑 비밀번호 재설정 토큰 만료시간
  @Column({ name: 'reset_token_expires_at', type: 'timestamptz', nullable: true })
  resetTokenExpiresAt: Date | null;


  // 📅 생성일
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // 📅 수정일
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
