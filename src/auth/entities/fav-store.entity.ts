import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Auth } from './auth.entity';

@Entity({name: 'fav_store' })
export class FavStore {
  @PrimaryGeneratedColumn({ name: 'fav_id' })
  id: number; // PK

  @ManyToOne(() => Auth, (auth) => auth.favStores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Auth;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'fav_store_cancel', type: 'boolean', default: false })
  favStoreCancel: boolean;
}
