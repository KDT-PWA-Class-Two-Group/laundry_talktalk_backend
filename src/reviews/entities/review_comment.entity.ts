import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from "typeorm";
import { Review } from "./review.entity";

@Entity("review_comment")
export class ReviewComment {
  @PrimaryGeneratedColumn()
  review_comment_id: number; // 댓글 PK

  @Column()
  reservation_id: number;

  @Column()
  user_id: number;

  @Column()
  store_id: number;

  @Column()
  admin_id: number;

  @Column({ type: "text" })
  review_comment_contents: string;

  @Column()
  review_comment_create_time: string;

  @Column({ default: false })
  review_comment_cancel: boolean;

  // 1:1 관계: 댓글이 속한 리뷰
  @OneToOne(() => Review)
  @JoinColumn({ name: "review_id" }) // 외래키
  review: Review;
}
