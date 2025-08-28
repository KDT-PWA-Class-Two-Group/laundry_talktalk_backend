// src/reviews/dto/create-review.dto.ts
export class CreateReviewDto {
  storeId: number; // 매장 ID
  reservationId: number; // 예약 ID
  rating: string; // 매장별점
  content: string; // 리뷰 내용
}