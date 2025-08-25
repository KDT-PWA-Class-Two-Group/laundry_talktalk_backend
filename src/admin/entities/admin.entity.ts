import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryGeneratedColumn('increment')
  admin_id: number;

  @Column({ type: 'varchar', length: 255 })
  user_id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  store_id: string;

  @OneToMany(() => Store, (store) => store.admin, {
    cascade: false,
    eager: false
  })
  stores: Store[];
}