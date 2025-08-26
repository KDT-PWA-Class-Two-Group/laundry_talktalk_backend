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
}
