import { Store } from '../entities/store.entity';

export class StoreDetailResponseDto {
  store_id: number;
  admin_id: number;
  store_name: string;
  store_address: string;
  store_number: string;
  store_latitude: number;
  store_longitude: number;
  store_url: string;
  store_business_hour_start_time: string;
  store_business_hour_end_time: string;

  constructor(store: Store) {
    this.store_id = store.store_id;
    this.admin_id = store.admin?.admin_id;
    this.store_name = store.store_name;
    this.store_address = store.store_address;
    this.store_number = store.store_number;
    this.store_latitude = store.store_latitude;
    this.store_longitude = store.store_longitude;
    this.store_url = store.store_url;
    this.store_business_hour_start_time = store.store_business_hour_start_time;
    this.store_business_hour_end_time = store.store_business_hour_end_time;
  }
}
