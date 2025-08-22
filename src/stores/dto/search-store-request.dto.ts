export class SearchStoreRequestDto {
  keyword: string;
  page?: number = 1;
  limit?: number = 10;
}
