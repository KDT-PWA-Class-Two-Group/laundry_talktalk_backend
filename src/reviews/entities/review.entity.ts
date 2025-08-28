import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { ReviewComment } from "./review_comment.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { Auth } from "../../auth/entities/auth.entity";
import { Store } from "../../stores/entities/store.entity";

@Entity("review")
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @ManyToOne(() => Reservation, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ManyToOne(() => Auth, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'user_id' })
  user: Auth;

  @ManyToOne(() => Store, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: "decimal", precision: 2, scale: 1 })
  rating: number;

  @Column({ type: "text" })
  review_contents: string;

  @CreateDateColumn()
  review_create_time: Date;

  @Column({ default: false })
  review_cancel: boolean;

  // 1:1 관계: 이 리뷰에 딱 하나의 댓글
  @OneToOne(() => ReviewComment, (comment) => comment.review)
  comment: ReviewComment;
}
