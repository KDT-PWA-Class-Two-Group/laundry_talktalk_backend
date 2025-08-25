// src/reviews/reviews.controller.ts
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
import { ReviewComment } from './entities/review_comment.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(ReviewComment)
    private readonly commentRepository: Repository<ReviewComment>,
  ) {}

  // 📌 리뷰 작성
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<{ message: string }> {
    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      review_contents: createReviewDto.content,
      store: { store_id: createReviewDto.storeId }, // FK 관계 설정
      user: { id: createReviewDto.userId }, // FK 관계 설정
      reservation: { reservation_id: createReviewDto.reservationId }, // FK 관계 설정
      machine: { machine_id: createReviewDto.machineId }, // FK 관계 설정
      review_create_time: new Date().toISOString(),
      review_cancel: false,
    });
    await this.reviewRepository.save(review);
    return { message: '리뷰가 등록되었습니다.' };
  }

  // 📌 매장별 리뷰 조회
  @Get('store/:storeId')
  async findByStore(
    @Param('storeId', ParseIntPipe) storeId: number, 
    @Query('sort') sort?: string
  ): Promise<any[]> {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.store', 'store')
      .where('store.store_id = :storeId', { storeId });

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
  @Post(':reviewId/comment')
  async addComment(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() addCommentDto: AddCommentDto,
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
  @Delete(':reviewId')
  async remove(@Param('reviewId', ParseIntPipe) reviewId: number): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOneBy({
      review_id: reviewId,
    });
    if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');

    await this.reviewRepository.remove(review);

    return { message: '리뷰가 삭제되었습니다.' };
  }
}
