// src/reviews/reviews.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  BadRequestException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddCommentDto } from "./dto/add-comment.dto";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Review } from "./entities/review.entity";
import { ReviewComment } from "./entities/review_comment.entity";
import { Reservation } from "../reservation/entities/reservation.entity";

@Controller("reviews")
export class ReviewsController {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(ReviewComment)
    private readonly commentRepository: Repository<ReviewComment>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>
  ) {}

  // 📌 리뷰 작성
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<{ message: string; review: any }> {
    try {
      // 예약 정보 조회 (user_id, store_id를 가져오기 위해)
      const reservation = await this.reservationRepository.findOne({
        where: { reservation_id: createReviewDto.reservationId },
        relations: ['user', 'store']
      });

      if (!reservation) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      // 이미 리뷰가 작성되었는지 확인
      const existingReview = await this.reviewRepository.findOne({
        where: { reservation: { reservation_id: createReviewDto.reservationId } }
      });

      if (existingReview) {
        throw new BadRequestException('이미 리뷰가 작성된 예약입니다.');
      }

      // 새 리뷰 생성
      const review = this.reviewRepository.create({
        rating: createReviewDto.rating,
        review_contents: createReviewDto.content,
        reservation: reservation,
        user: reservation.user,
        store: reservation.store,
        review_cancel: false
      });

      const savedReview = await this.reviewRepository.save(review);

      return { 
        message: "리뷰가 성공적으로 작성되었습니다.",
        review: {
          id: savedReview.review_id,
          reservationId: createReviewDto.reservationId,
          rating: savedReview.rating,
          content: savedReview.review_contents,
          createdAt: savedReview.review_create_time
        }
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('리뷰 작성 중 오류가 발생했습니다.');
    }
  }

  // 📌 매장별 리뷰 조회
  @Get("store/:storeId")
  async findByStore(
    @Param("storeId", ParseIntPipe) storeId: number,
    @Query("sort") sort?: string
  ): Promise<any[]> {
    const query = this.reviewRepository
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.store", "store")
      .leftJoinAndSelect("review.reservation", "reservation")
      .where("review.store.store_id = :storeId", { storeId })
      .andWhere("review.review_cancel = :cancel", { cancel: false });

    if (sort === "latest") {
      query.orderBy("review.review_create_time", "DESC");
    } else {
      query.orderBy("review.review_create_time", "ASC");
    }

    const reviews = await query.getMany();

    return reviews.map((r) => ({
      reviewId: r.review_id,
      rating: r.rating,
      content: r.review_contents,
      createdAt: r.review_create_time,
      userName: r.user?.loginId || '익명',
      reservationId: r.reservation?.reservation_id
    }));
  }

  // 📌 리뷰에 댓글 작성/수정
  @Post(":reviewId/comment")
  async addComment(
    @Param("reviewId", ParseIntPipe) reviewId: number,
    @Body() addCommentDto: AddCommentDto
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOneBy({
      review_id: reviewId
    });
    if (!review) throw new NotFoundException("리뷰를 찾을 수 없습니다.");

    const comment = this.commentRepository.create({
      review_comment_contents: addCommentDto.content,
      review_comment_create_time: new Date().toISOString(),
      review_comment_cancel: false,
      review: review // 1:1 관계 연결
    });

    await this.commentRepository.save(comment);

    return { message: "댓글이 등록되었습니다." };
  }

  // 📌 리뷰 삭제
  @Delete(":reviewId")
  async remove(
    @Param("reviewId", ParseIntPipe) reviewId: number
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOneBy({
      review_id: reviewId
    });
    if (!review) throw new NotFoundException("리뷰를 찾을 수 없습니다.");

    await this.reviewRepository.remove(review);

    return { message: "리뷰가 삭제되었습니다." };
  }
}
