import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity({ name: 'store_notice_event' })
export class StoreNoticeEvent {
  @PrimaryGeneratedColumn()
  store_notice_event_id: number;

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

  @Column({ type: 'boolean' })
  store_notice_event_type: boolean;

  @Column({ type: 'varchar', length: 255 })
  store_notice_event_title: string;

  @Column({ type: 'text' })
  store_notice_event_contents: string;

  @Column({ type: 'varchar', length: 32 })
  store_notice_event_create_time: string;

  @Column({ type: 'varchar', length: 32 })
  store_notice_event_start_time: string;

  @Column({ type: 'varchar', length: 32 })
  store_notice_event_end_time: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  store_notice_event_image_url: string;
}
