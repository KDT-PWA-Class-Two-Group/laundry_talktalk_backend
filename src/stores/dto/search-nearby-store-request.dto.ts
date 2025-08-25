export class SearchNearbyRequestStoreDto {
  lat: number;
  lng: number;
  radius?: number = 3; // 기본 3km 반경
}
