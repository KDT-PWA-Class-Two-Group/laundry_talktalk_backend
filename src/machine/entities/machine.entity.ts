import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Auth, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'user_id' })
  user: Auth;

  @ManyToOne(() => MachineOptions, { 
    eager: false,
    nullable: false 
  })
  @JoinColumn({ name: 'options_id' })
  options: MachineOptions;

  @Column({ type: "boolean", nullable: true })
  machine_type: boolean;
}
