export class CreateReservationDto {
  user_id2: number;
  store_id2: number;
  admin_id: number;
  reservation_create_time: string;
  reservation_start_time: string;
  reservation_end_time: string;
  machine_id: string;
  reservation_cancel: boolean;
}
