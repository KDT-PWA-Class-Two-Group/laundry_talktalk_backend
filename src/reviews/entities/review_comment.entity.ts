import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('review_comment') // DB 테이블 이름
export class ReviewComment {
  @PrimaryGeneratedColumn()
  review_comment_id: number; // 리뷰 대댓글 id

  @Column({ type: 'text' })
  review_comment_contents: string; // 대댓글 내용

  @Column({ type: 'varchar', length: 100 })
  review_comment_create_time: string; // 대댓글 생성 날짜

  @Column({ type: 'boolean', default: false })
  review_comment_cancel: boolean; // 대댓글 삭제 여부
}
