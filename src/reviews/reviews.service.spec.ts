import { Test, TestingModule } from '@nestjs/testing';
<<<<<<<< HEAD:src/users/users.service.spec.ts
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
========
import { ReviewsService } from './reviews.service';

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewsService],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
>>>>>>>> origin/han-jae-hee/issue2:src/reviews/reviews.service.spec.ts
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
