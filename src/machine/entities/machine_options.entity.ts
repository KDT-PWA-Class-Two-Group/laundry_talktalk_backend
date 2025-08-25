import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "machine_options" })
export class MachineOption {
  @PrimaryGeneratedColumn({ type: "int" })
  options_id: number;

  @Column({ type: "int" })
  machine_id: number;

  @Column({ type: "int" })
  store_id2: number;

  @Column({ type: "int" })
  admin_id: number;

  @Column({ type: "varchar" })
  options_name: string;

  @Column({ type: "varchar" })
  options_base_time: string;

  @Column({ type: "varchar" })
  options_base_price: string;

  @Column({ type: "varchar" })
  options_type: string;
}
