import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ReviewComment } from './review_comment.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column()
  reservation_id2: number;

  @Column()
  user_id2: number;

  @Column()
  store_id2: number;

  @Column()
  admin_id: number;

  @Column()
  rating: string;

  @Column({ type: 'text' })
  review_contents: string;

  @Column()
  review_create_time: string;

  @Column({ default: false })
  review_cancel: boolean;

  // 1:1 관계: 이 리뷰에 딱 하나의 댓글
  @OneToOne(() => ReviewComment, (comment) => comment.review)
  comment: ReviewComment;
}
