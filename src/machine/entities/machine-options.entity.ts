import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'boolean', nullable: true })
  machine_type: boolean; // true: 세탁기, false: 건조기

  // 1:Many 관계: 하나의 옵션이 여러 기계에 사용될 수 있음
  @OneToMany('Machine', 'options')
  machines: any[];

  // Many:Many 관계: 추가 옵션으로 여러 기계에 사용될 수 있음
  @ManyToMany('Machine', 'additionalOptions')
  additionalMachines: any[];
}
