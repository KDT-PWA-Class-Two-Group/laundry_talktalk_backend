
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { StoreNoticeEventService } from './store_notice_event.service';
import { CreateStoreNoticeEventDto } from './dto/create-store_notice_event.dto';
import { UpdateStoreNoticeEventDto } from './dto/update-store_notice_event.dto';

@Controller('store_notice_event')
export class StoreNoticeEventController {
	constructor(private readonly service: StoreNoticeEventService) {}

	@Get(':storeId')
	findAll(@Param('storeId') storeId: number, @Query('category') category?: string) {
		return this.service.findAll(storeId, category);
	}

	@Post()
	create(@Body() dto: CreateStoreNoticeEventDto) {
		return this.service.create(dto);
	}

	@Put(':id')
	update(@Param('id') id: number, @Body() dto: UpdateStoreNoticeEventDto) {
		return this.service.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.service.remove(id);
	}
}
