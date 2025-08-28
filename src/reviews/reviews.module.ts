import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { Review } from "./entities/review.entity";
import { ReviewComment } from "./entities/review_comment.entity";
import { Reservation } from "../reservation/entities/reservation.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewComment, Reservation]) // Reservation repository 추가
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
