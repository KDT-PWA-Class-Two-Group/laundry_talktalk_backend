import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { FavStore } from './fav-store.entity';

@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number; // PK

  // @Column({ name: 'login_id', unique: true })
  // loginId: string; // 로그인 아이디

  @OneToMany(() => FavStore, (favStore) => favStore.user)
  favStores: FavStore[];

  @Column({ name: 'login_id', type: 'varchar', length: 50, unique: true, nullable: true })
  loginId: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;


  @Exclude()
  @Column({ name: 'password', select: false })
  passwordHash: string;

  @Column({ nullable: true })
  phone?: string;

  @Exclude()
  @Column({ name: 'access_token', nullable: true, select: false })
  accessToken?: string;

  @Exclude()
  @Column({ name: 'refresh_token', nullable: true, select: false })
  refreshToken?: string;

  @Column({ name: 'user_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
