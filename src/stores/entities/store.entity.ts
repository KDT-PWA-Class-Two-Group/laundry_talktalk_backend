import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn('increment')
  store_id: number;

  @ManyToOne(() => Admin, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({ type: 'varchar', length: 255 })
  store_name: string;

  @Column({ type: 'varchar', length: 500 })
  store_address: string;

  @Column({ type: 'varchar', length: 20 })
  store_number: string;

  @Column({ type: 'float' })
  store_latitude: number;

  @Column({ type: 'float' })
  store_longitude: number;

  @Column({ type: 'varchar', length: 500 })
  store_url: string;

  @Column({ type: 'time' })
  store_business_hour_start_time: string;

  @Column({ type: 'time' })
  store_business_hour_end_time: string;
}
