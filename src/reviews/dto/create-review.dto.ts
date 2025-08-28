import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

// src/reviews/dto/create-review.dto.ts
export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  reservationId: number; // 예약 ID

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number; // 별점 (1-5)

  @IsNotEmpty()
  @IsString()
  content: string; // 리뷰 내용 (프론트엔드에서는 reviewText로 보내지만 content로 받음)
}
