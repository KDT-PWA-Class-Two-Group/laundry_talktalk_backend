import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn('increment', { name: 'store_id' })
  id: number;

  @Column({ name: 'store_name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'store_address', type: 'varchar', length: 500 })
  address: string;

  @Column({ name: 'store_number', type: 'varchar', length: 20 })
  number: string;

  @Column({ name: 'store_score', type: 'float', default: 0.0 })
  score: number;

  @Column({ name: 'store_latitude', type: 'float' })
  latitude: number;

  @Column({ name: 'store_longitude', type: 'float' })
  longitude: number;
}

