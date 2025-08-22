import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from './auth.entity';
import { Store } from 'src/stores/entities/store.entity';

@Entity({name: 'fav_store' })
export class FavStore {
  @PrimaryGeneratedColumn({ name: 'fav_id' })
  id: number; // PK

  @ManyToOne(() => Auth, { eager: true })
  @JoinColumn({ name: 'user_id2' })
  user: Auth;

  @ManyToOne(() => Store, { eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'fav_store_cancel', type: 'boolean', default: false })
  favStoreCancel: boolean;
}
