export class CreateStoreDto {
  submit_id: string;
  store_name: string;
  store_address: string;
  store_number: string;
  store_score?: number;
  store_latitude: number;
  store_longitude: number;
}
