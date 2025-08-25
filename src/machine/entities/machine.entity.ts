import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "machine" })
export class Machine {
  @PrimaryGeneratedColumn({ type: "int" })
  machine_id: number;

  @Column({ type: "int" })
  store_id2: number;

  @Column({ type: "int" })
  admin_id: number;

  @Column({ type: "boolean" })
  machine_type: boolean;
}
