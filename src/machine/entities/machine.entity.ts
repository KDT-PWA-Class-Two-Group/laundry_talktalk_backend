import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Auth } from "../../auth/entities/auth.entity";
import { Store } from "../../stores/entities/store.entity";
import { MachineOptions } from "./machine-options.entity";

@Entity({ name: "machine" })
export class Machine {
  @PrimaryGeneratedColumn({ type: "int" })
  machine_id: number;

  @ManyToOne(() => Store, {
    eager: false,
    nullable: false
  })
  @JoinColumn({ name: "store_id" })
  store: Store;

  @ManyToOne(() => Auth, {
    eager: false,
    nullable: false
  })
  @JoinColumn({ name: "user_id" })
  user: Auth;

  // 세탁기 옵션들 (Many-to-Many 관계)
  @ManyToMany(() => MachineOptions)
  @JoinTable({
    name: "machine_options_relation",
    joinColumn: { name: "machine_id", referencedColumnName: "machine_id" },
    inverseJoinColumn: { name: "option_id", referencedColumnName: "options_id" }
  })
  options: MachineOptions[];

  @Column({ type: "boolean", nullable: true })
  machine_type: boolean;
}
