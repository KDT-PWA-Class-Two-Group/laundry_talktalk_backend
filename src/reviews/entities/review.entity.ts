import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Machine } from '../../machine/entities/machine.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Store } from '../../stores/entities/store.entity';
import { ReviewComment } from './review_comment.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

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

  @Column({ type: 'varchar', length: 10, nullable: true })
  rating: string;

  @Column({ type: 'text' })
  review_contents: string;

  @Column()
  review_create_time: string;

  @Column({ default: false })
  review_cancel: boolean;

  // 1:Many 관계: 이 리뷰에 여러 댓글이 달릴 수 있음
  @OneToMany(() => ReviewComment, (comment) => comment.review)
  comments: ReviewComment[];
}
