import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "../../auth/entities/auth.entity";
import { Machine } from "../../machine/entities/machine.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { Store } from "../../stores/entities/store.entity";
import { ReviewComment } from "./review_comment.entity";


@Entity("review")
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  id: number; // PK

  // 🔗 예약 ID (외래키)
  @Column({ name: 'reservation_id', type: 'integer', nullable: false })
  reservationId: number;

  // 🏪 매장 ID (외래키)
  @Column({ name: 'store_id', type: 'integer', nullable: false })
  storeId: number;

  // 👤 사용자 ID (외래키)
  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  // 🔧 세탁기 ID (외래키)
  @Column({ name: 'machine_id', type: 'integer', nullable: false })
  machineId: number;

  // ⭐ 평점
  @Column({ name: 'rating', type: 'varchar', length: 10, nullable: true })
  rating: string;

  // 📝 리뷰 내용
  @Column({ name: 'review_contents', type: 'text', nullable: false })
  reviewContents: string;

  // 📅 리뷰 작성 시간
  @Column({ name: 'review_create_time', type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  reviewCreateTime: Date;

  // ❌ 리뷰 취소 여부
  @Column({ name: 'review_cancel', type: 'boolean', default: false })
  isReviewCanceled: boolean;

  // Foreign Key Relations
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

  // 1:N 관계: 하나의 리뷰에 여러 댓글
  @OneToOne(() => ReviewComment, (comment) => comment.review)
  comments: ReviewComment[];
}
