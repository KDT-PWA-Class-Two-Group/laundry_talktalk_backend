import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({schema:"store", name:'store'})
export class Store {
  @PrimaryGeneratedColumn('increment')
  store_id: number;

  @Column({ type: 'varchar', length: 255 })
  submit_id: string;

  @Column({ type: 'varchar', length: 255 })
  store_name: string;

  @Column({ type: 'varchar', length: 500 })
  store_address: string;

  @Column({ type: 'varchar', length: 20 })
  store_number: string;

  @Column({ type: 'float', default: 0.0 })
  store_score: number;

  @Column({ type: 'float' })
  store_latitude: number;

  @Column({ type: 'float' })
  store_longitude: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
