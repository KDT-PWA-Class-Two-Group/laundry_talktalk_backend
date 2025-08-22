// src/reviews/reviews.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ReviewComment } from './entities/review_comment.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(ReviewComment)
    private readonly commentRepository: Repository<ReviewComment>,
  ) {}

  // 📌 리뷰 작성
  async create(createReviewDto: CreateReviewDto): Promise<{ message: string }> {
    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      review_contents: createReviewDto.content,
      store_id2: createReviewDto.storeId,
      reservation_id2: createReviewDto.reservationId,
      review_create_time: new Date().toISOString(),
      review_cancel: false,
    });
    await this.reviewRepository.save(review);
    return { message: '리뷰가 등록되었습니다.' };
  }

  // 📌 매장별 리뷰 조회
  async findByStore(storeId: number, sort?: string): Promise<any[]> {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .where('review.store_id2 = :storeId', { storeId });

    if (sort === 'latest') {
      query.orderBy('review.review_create_time', 'DESC');
    }

    const reviews = await query.getMany();

    return reviews.map((r) => ({
      reviewId: r.review_id,
      rating: r.rating,
      content: r.review_contents,
      createdAt: r.review_create_time,
    }));
  }

  // 📌 리뷰에 댓글 작성/수정
  async addComment(
    reviewId: number,
    addCommentDto: AddCommentDto,
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOneBy({
      review_id: reviewId,
    });
    if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');

    const comment = this.commentRepository.create({
      review_comment_contents: addCommentDto.content,
      review_comment_create_time: new Date().toISOString(),
      review_comment_cancel: false,
      review: review, // 1:1 관계 연결
    });

    await this.commentRepository.save(comment);

    return { message: '댓글이 등록되었습니다.' };
  }

  // 📌 리뷰 삭제
  async remove(reviewId: number): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOneBy({
      review_id: reviewId,
    });
    if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');

    await this.reviewRepository.remove(review);

    return { message: '리뷰가 삭제되었습니다.' };
  }
}
