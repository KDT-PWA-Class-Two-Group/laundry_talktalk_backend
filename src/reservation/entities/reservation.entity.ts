import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Machine } from '../../machine/entities/machine.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity({ name: 'reservation' })
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @ManyToOne(() => Store, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Auth, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'user_id' })
  user: Auth;

  @ManyToOne(() => Machine, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  @Column({ type: 'time' })
  reservation_create_time: string;

  @Column({ type: 'time' })
  reservation_start_time: string;

  @Column({ type: 'time' })
  reservation_end_time: string;

  @Column({ type: 'boolean', default: false })
  reservation_cancel: boolean;
}
