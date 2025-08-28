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
    const storeId: number | undefined = undefined; // 임시: storeId 조회 미구현 시 undefined

    const review = this.reviewRepository.create({
      rating: rating,
      review_contents: reviewText,
      store_id: storeId, // 필드명 변경
      reservation_id: resId,
      review_create_time: new Date().toISOString(),
      review_cancel: false
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
      reviewId: r.review_id,
      rating: r.rating,
      content: r.review_contents,
      createdAt: r.review_create_time
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
