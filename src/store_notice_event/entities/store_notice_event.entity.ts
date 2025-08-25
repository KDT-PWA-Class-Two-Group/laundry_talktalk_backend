import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'store_notice_event' })
export class StoreNoticeEvent {
  @PrimaryGeneratedColumn()
  store_notice_event_id: number;

  @Column()
  store_id2: number;

  @Column()
  admin_id2: number;

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
