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

  @OneToMany(() => FavStore, (favStore) => favStore.user)
  favStores: FavStore[];

  @Column({ name: 'login_id', type: 'varchar', length: 50, unique: true, nullable: false })
  loginId: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ name: 'password', type: 'varchar', select: false })
  passwordHash: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Exclude()
  @Column({ name: 'access_token', type: 'varchar', nullable: true, select: false })
  accessToken?: string;

  @Exclude()
  @Column({ name: 'refresh_token', type: 'varchar', nullable: true, select: false })
  refreshToken?: string;

  @Column({ name: 'user_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
