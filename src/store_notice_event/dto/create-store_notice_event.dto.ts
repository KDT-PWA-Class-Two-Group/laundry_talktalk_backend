
export class CreateStoreNoticeEventDto {
	store_id: number;
	user_id: number;
	store_notice_event_type: boolean;
	store_notice_event_title: string;
	store_notice_event_contents: string;
	store_notice_event_create_time: string;
	store_notice_event_start_time: string;
	store_notice_event_end_time: string;
	store_notice_event_image_url?: string;
}
