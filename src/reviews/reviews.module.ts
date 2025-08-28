import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { Review } from "./entities/review.entity";
import { ReviewComment } from "./entities/review_comment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewComment]) // repository 등록
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
