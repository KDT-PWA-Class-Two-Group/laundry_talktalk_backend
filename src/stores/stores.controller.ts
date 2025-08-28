import { Controller, Delete, Get, Param, Query } from "@nestjs/common";
import { SearchNearbyRequestStoreDto } from "./dto/search-nearby-store-request.dto";
import { SearchStoreRequestDto } from "./dto/search-store-request.dto";
import { SearchStoreResponseDto } from "./dto/search-store-response.dto";
import { StoreDetailResponseDto } from "./dto/store-detail-response.dto";
import { StoresService } from "./stores.service";

@Controller("stores")
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async getAllStores(): Promise<StoreDetailResponseDto[]> {
    return this.storesService.getAllStores();
  }

  @Get("search/keyword")
  searchByKeyword(
    @Query() searchDto: SearchStoreRequestDto
  ): Promise<SearchStoreResponseDto> {
    const { keyword, page = 1, limit = 10 } = searchDto;
    return this.storesService.searchByKeyword(keyword, page, limit);
  }

  @Get("search/nearby")
  searchNearbyStores(
    @Query() nearbyDto: SearchNearbyRequestStoreDto
  ): Promise<SearchStoreResponseDto> {
    const { lat, lng, radius = 5 } = nearbyDto;
    return this.storesService.searchNearbyStores(lat, lng, radius);
  }

  @Get(":id")
  async getStoreDetail(
    @Param("id") storeId: string
  ): Promise<StoreDetailResponseDto> {
    return this.storesService.getStoreDetail(+storeId);
  }

  @Delete(":id")
  async remove(@Param("id") storeId: string) {
    return this.storesService.remove(+storeId);
  }

  @Get(":storeId/machines")
  async getStoreMachines(@Param("storeId") storeId: string) {
    // StoresService에서 모든 기기 목록을 가져옵니다.
    const machines = await this.storesService.getMachinesByStoreId(+storeId);

    // 기기 목록을 세탁기와 건조기로 나눕니다.
    const washers = machines.filter((machine) => machine.machine_type === true);
    const dryers = machines.filter((machine) => machine.machine_type === false);

    // 프런트엔드가 예상하는 객체 형태로 반환합니다.
    return {
      washers,
      dryers
    };
  }
}
