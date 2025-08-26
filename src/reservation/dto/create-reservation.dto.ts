export class CreateReservationDto {
  user_id: number;
  store_id: number;
  reservation_create_time: string;
  reservation_start_time: string;
  reservation_end_time: string;
  machine_id: string;
  reservation_cancel: boolean;
}
