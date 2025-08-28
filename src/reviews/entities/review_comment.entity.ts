import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Auth } from "../../auth/entities/auth.entity";
import { Machine } from "../../machine/entities/machine.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { Store } from "../../stores/entities/store.entity";
import { Review } from "./review.entity";

@Entity("review_comment")
export class ReviewComment {
  @PrimaryGeneratedColumn({ name: 'review_comment_id' })
  id: number; // PK

  // 🔗 리뷰 ID (외래키)
  @Column({ name: 'review_id', type: 'integer', nullable: false })
  reviewId: number;

  // 🔗 예약 ID (외래키)
  @Column({ name: 'reservation_id', type: 'integer', nullable: false })
  reservationId: number;

  // 👤 사용자 ID (외래키)
  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  // 🏪 매장 ID (외래키)
  @Column({ name: 'store_id', type: 'integer', nullable: false })
  storeId: number;

  // 🔧 세탁기 ID (외래키)
  @Column({ name: 'machine_id', type: 'integer', nullable: false })
  machineId: number;

  // 💬 댓글 내용
  @Column({ name: 'review_comment_contents', type: 'text', nullable: false })
  reviewCommentContents: string;

  // 📅 댓글 작성 시간
  @Column({ name: 'review_comment_create_time', type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  reviewCommentCreateTime: Date;

  // ❌ 댓글 취소 여부
  @Column({ name: 'review_comment_cancel', type: 'boolean', default: false })
  isReviewCommentCanceled: boolean;

  // Foreign Key Relations
  @ManyToOne(() => Review)
  @JoinColumn({ name: "review_id" })
  review: Review;

  @ManyToOne(() => Reservation)
  @JoinColumn({ name: "reservation_id" })
  reservation: Reservation;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id" })
  store: Store;

  @ManyToOne(() => Auth)
  @JoinColumn({ name: "user_id" })
  user: Auth;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: "machine_id" })
  machine: Machine;
}
