import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Auth } from "../../auth/entities/auth.entity";
import { FavStore } from "../../auth/entities/fav-store.entity";
import { Machine } from "../../machine/entities/machine.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { Review } from "../../reviews/entities/review.entity";

@Entity({ name: "store" })
export class Store {
  @PrimaryGeneratedColumn("increment")
  store_id: number;

  @ManyToOne(() => Auth, {
    eager: false,
    nullable: false
  })
  @JoinColumn({ name: "user_id" })
  user: Auth;

  @Column({ type: "varchar", length: 255 })
  store_name: string;

  @Column({ type: "varchar", length: 500 })
  store_address: string;

  @Column({ type: "varchar", length: 20 })
  store_number: string;

  @Column({ type: "float" })
  store_latitude: number;

  @Column({ type: "float" })
  store_longitude: number;

  @Column({ type: "varchar", length: 500 })
  store_url: string;

  @Column({ type: "time" })
  store_business_hour_start_time: string;

  @Column({ type: "time" })
  store_business_hour_end_time: string;

  @OneToMany(() => FavStore, (favStore) => favStore.store)
  favStores: FavStore[];

  @OneToMany(() => Machine, (machine) => machine.store)
  machines: Machine[];

  @OneToMany(() => Reservation, (reservation) => reservation.store)
  reservations: Reservation[];

  @OneToMany(() => Review, (review) => review.store)
  reviews: Review[];

  @OneToMany(
    "StoreNoticeEvent",
    (storeNoticeEvent: any) => storeNoticeEvent.store
  )
  storeNoticeEvents: any[];
}
