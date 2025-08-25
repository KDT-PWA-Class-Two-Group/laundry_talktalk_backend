import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reservation' })
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @Column()
  user_id2: number;

  @Column()
  store_id2: number;

  @Column()
  admin_id: number;

  @Column({ type: 'varchar' })
  reservation_create_time: string;

  @Column({ type: 'varchar' })
  reservation_start_time: string;

  @Column({ type: 'varchar' })
  reservation_end_time: string;

  @Column({ type: 'varchar' })
  machine_id: string;

  @Column({ type: 'boolean' })
  reservation_cancel: boolean;
}
