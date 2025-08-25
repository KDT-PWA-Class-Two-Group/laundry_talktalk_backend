
import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreNoticeEventDto } from './create-store_notice_event.dto';

export class UpdateStoreNoticeEventDto extends PartialType(CreateStoreNoticeEventDto) {}
