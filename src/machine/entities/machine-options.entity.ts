import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Machine } from './machine.entity';

@Entity({ name: 'machine_options' })
export class MachineOptions {
  @PrimaryGeneratedColumn('increment')
  options_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  options_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  options_base_time: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  options_base_price: string;

  @Column({ type: 'boolean', nullable: true })
  options_type: boolean;

  // 1:Many 관계: 하나의 옵션이 여러 기계에 사용될 수 있음
  @OneToMany(() => Machine, (machine) => machine.options)
  machines: Machine[];
}
