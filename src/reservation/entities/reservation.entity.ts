import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @Column()
  user_id2: number;

  @Column()
  store_id2: number;

  @Column()
  admin_id: number;

  @Column({ type: 'varchar', length: 32 })
  reservation_create_time: string;

  @Column({ type: 'varchar', length: 32 })
  reservation_start_time: string;

  @Column({ type: 'varchar', length: 32 })
  reservation_end_time: string;

  @Column({ type: 'varchar', length: 32 })
  machine_id: string;

  @Column({ type: 'boolean' })
  reservation_cancel: boolean;
}
