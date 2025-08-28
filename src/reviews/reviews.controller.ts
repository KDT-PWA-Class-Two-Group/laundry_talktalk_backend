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
  Query
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddCommentDto } from "./dto/add-comment.dto";
// import { CreateReviewDto } from "./dto/create-review.dto";
import { Review } from "./entities/review.entity";
import { ReviewComment } from "./entities/review_comment.entity";

@Controller("reviews")
export class ReviewsController {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(ReviewComment)
    private readonly commentRepository: Repository<ReviewComment>
  ) {}

  // 📌 리뷰 작성
  /**
   * 프론트엔드에서 rating, reviewText만 오고, URL의 id가 reservationId임
   * storeId는 reservationId로 조회해서 넣어줌
   */
  @Post()
  async create(
    @Body()
    body: {
      rating: number | string;
      reviewText: string;
      reservationId?: number;
    }
  ): Promise<{ message: string }> {
    // body: { rating, reviewText, reservationId? }
    const rating: string = String(body.rating);
    const reviewText: string = String(body.reviewText);
    const resId: number | undefined = body.reservationId;
    // reservationId로 storeId 조회 (reservation 테이블 필요)
    const storeId: number = 1; // 임시: 실제로는 reservationId로 조회해야 함

    const review = this.reviewRepository.create({
      rating: rating,
      reviewContents: reviewText,
      storeId: storeId,
      reservationId: resId || 1, // 임시: reservationId도 필수값이므로 기본값 설정
      userId: 1, // 임시 값 - JWT에서 가져와야 함
      machineId: 1, // 임시 값 - 예약 정보에서 가져와야 함
      isReviewCanceled: false
      // reviewCreateTime은 데이터베이스에서 자동으로 CURRENT_TIMESTAMP 설정됨
    });
    await this.reviewRepository.save(review);
    return { message: "리뷰가 등록되었습니다." };
  }

  // 📌 매장별 리뷰 조회
  @Get("store/:storeId")
  async findByStore(
    @Param("storeId", ParseIntPipe) storeId: number,
    @Query("sort") sort?: string
  ): Promise<any[]> {
    const query = this.reviewRepository
      .createQueryBuilder("review")
      .where("review.store_id = :storeId", { storeId });

    if (sort === "latest") {
      query.orderBy("review.review_create_time", "DESC");
    }

    const reviews = await query.getMany();

    return reviews.map((r) => ({
      reviewId: r.id,
      rating: r.rating,
      content: r.reviewContents,
      createdAt: r.reviewCreateTime
    }));
  }

  // 📌 리뷰에 댓글 작성/수정
  @Post(":reviewId/comment")
  async addComment(
    @Param("reviewId", ParseIntPipe) reviewId: number,
    @Body() addCommentDto: AddCommentDto
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOneBy({
      id: reviewId
    });
    if (!review) throw new NotFoundException("리뷰를 찾을 수 없습니다.");

    const comment = this.commentRepository.create({
      reviewCommentContents: addCommentDto.content,
      isReviewCommentCanceled: false,
      reviewId: reviewId,
      reservationId: review.reservationId,
      userId: review.userId,
      storeId: review.storeId,
      machineId: review.machineId,
      review: review // 1:1 관계 연결
      // reviewCommentCreateTime은 데이터베이스에서 자동으로 CURRENT_TIMESTAMP 설정됨
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
      id: reviewId
    });
    if (!review) throw new NotFoundException("리뷰를 찾을 수 없습니다.");

    await this.reviewRepository.remove(review);

    return { message: "리뷰가 삭제되었습니다." };
  }
}
