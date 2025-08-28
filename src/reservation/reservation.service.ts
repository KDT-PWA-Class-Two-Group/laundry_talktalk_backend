import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reservation } from "./entities/reservation.entity";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>
  ) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationRepository.create(dto);
    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async findOne(id: number): Promise<Reservation | null> {
    return this.reservationRepository.findOne({
      where: { reservation_id: id }
    });
  }

  async update(
    id: number,
    dto: UpdateReservationDto
  ): Promise<Reservation | null> {
    await this.reservationRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.reservationRepository.delete(id);
  }

  // 사용자별 예약 조회
  async findByUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: ["user", "store", "machine"], // 필요에 따라 조정
      order: { reservation_create_time: "DESC" }
    });
  }
}
