// src/reviews/reviews.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { Review } from "./entities/review.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}

  // 리뷰 생성
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return await this.reviewRepository.save(review);
  }

  // 모든 리뷰 조회
  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: ["comment"] // 댓글도 함께 가져오기
    });
  }

  // 특정 리뷰 조회
  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: id },
      relations: ["comment"]
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  // 리뷰 수정
  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  // 리뷰 삭제
  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}
