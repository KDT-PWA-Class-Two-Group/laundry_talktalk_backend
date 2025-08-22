import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('review') // DB 테이블 이름
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number; // 리뷰 id

  @Column({ type: 'varchar', length: 50 })
  rating: string; // 매장별점 (String)

  @Column({ type: 'text' })
  review_contents: string; // 리뷰내용

  @Column({ type: 'varchar', length: 100 })
  review_create_time: string; // 리뷰생성날짜 (문자열 저장)

  @Column({ type: 'boolean', default: false })
  review_cancel: boolean; // 리뷰삭제여부
}
