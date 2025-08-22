import { Store } from '../entities/store.entity';

export class SearchStoreResponseDto {
  data: Store[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
