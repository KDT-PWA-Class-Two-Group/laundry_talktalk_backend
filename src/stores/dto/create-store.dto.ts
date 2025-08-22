export class CreateStoreDto {
  name: string;
  address: string;
  number: string;
  score?: number;      // 기본값 0.0 가능
  latitude: number;
  longitude: number;
}
