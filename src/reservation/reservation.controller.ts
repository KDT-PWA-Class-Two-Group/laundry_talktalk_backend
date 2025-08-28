import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  // 이용 내역 조회 (페이징)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // 서비스에서 페이징 처리된 예약 내역 반환
    // 서비스에 페이징이 없으므로 전체 조회만 반환
    const reservations = await this.service.findAll();
    // 사진 예시처럼 reservationId만 반환, 나머지는 주석 처리
    return reservations.map(r => ({
      reservationId: r.reservation_id,
      // storeName: '', // 엔티티에 없으므로 빈 값
      // status: '',    // 엔티티에 없으므로 빈 값
    }));
  }

  // 예약 상세 조회 필요시 추가
  // @Get(':reservationId')
  // async findOne(@Param('reservationId') reservationId: number) {
  //   return await this.service.findOne(reservationId);
  // }

  // 세탁/건조 예약하기
  @Post()
  async create(@Body() dto: CreateReservationDto) {
    try {
      const reservation = await this.service.create(dto);
      return {
        reservationId: reservation.reservation_id,
        message: '예약이 완료되었습니다.'
      };
    } catch (e) {
      return {
        message: '예약 정보가 올바르지 않습니다.'
      };
    }
  }

  // 예약 취소
  @Delete(':reservationId')
  async cancel(@Param('reservationId') reservationId: number) {
    // 서비스에 cancel 메서드가 없으므로 remove 사용
    try {
      await this.service.remove(reservationId);
      return { message: '예약이 취소되었습니다.' };
    } catch (e) {
      return { message: '취소할 수 없는 예약입니다.' };
    }
  }

  // 사용자별 예약 조회
  @Get('user/:userId')
  async getUserReservations(@Param('userId') userId: number) {
    try {
      // Reservation 전체 객체를 반환하되, id 필드를 추가해줌
      const reservations = await this.service.findByUser(Number(userId));
      return reservations.map(r => ({ ...r, id: r.reservation_id }));
    } catch (e) {
      return { message: '예약 정보를 조회할 수 없습니다.' };
    }
  }
}
