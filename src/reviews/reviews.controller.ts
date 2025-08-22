import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 📌 리뷰 작성
  @Post()
  async createReview(
    @Body()
    body: {
      storeId: number;
      reservationId: number;
      rating: number;
      content: string;
    },
  ) {
    // 서비스에 위임 (임시 반환)
    return { message: '리뷰가 등록되었습니다.' };
  }

  // 📌 리뷰 목록 조회
  @Get(':storeId')
  async getReviews(
    @Param('storeId') storeId: number,
    @Query('sort') sort: string,
  ) {
    // 서비스에 위임 (임시 반환)
    return [
      {
        reviewId: 1,
        author: '김행님',
        rating: 5,
        content: '깨끗하고 좋았어요!',
      },
    ];
  }

  // 📌 리뷰에 댓글 작성/수정
  @Post(':reviewId/comment')
  async addComment(
    @Param('reviewId') reviewId: number,
    @Body() body: { content: string },
  ) {
    // 서비스에 위임 (임시 반환)
    return { message: '댓글이 등록되었습니다.' };
  }

  // 📌 리뷰 삭제
  @Delete(':reviewId')
  async deleteReview(@Param('reviewId') reviewId: number) {
    // 서비스에 위임 (임시 반환)
    return { message: '리뷰가 삭제되었습니다.' };
  }
}
