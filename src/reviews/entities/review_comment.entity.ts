import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Machine } from '../../machine/entities/machine.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Store } from '../../stores/entities/store.entity';
import { Review } from './review.entity';

@Entity('review_comment')
export class ReviewComment {
  @PrimaryGeneratedColumn()
  review_comment_id: number; // 댓글 PK

  @ManyToOne(() => Review, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @ManyToOne(() => Reservation, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

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

  @Column({ type: 'text' })
  review_comment_contents: string;

  @Column({ type: 'time' })
  review_comment_create_time: string;

  @Column({ default: false })
  review_comment_cancel: boolean;
}
