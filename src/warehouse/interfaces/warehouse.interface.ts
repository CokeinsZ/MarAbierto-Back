import {
  ChangeWarehouseStatusDto,
  GetWarehouseByNameDto,
  GetWarehousesByCityDto,
  GetWarehousesByStatusDto,
  ListWarehousesDto,
  UpdateWarehouseDto,
  CreateWarehouseDto,
} from '../dtos/warehouse.dto';

export enum warehouseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_MAINTENANCE = 'under_maintenance',
  FULL = 'full',
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  address: string;
  status: warehouseStatus;
}

export interface WarehouseServiceInterface {
  createWarehouse(dto: CreateWarehouseDto): Promise<Warehouse>;
  listWarehouses(dto: ListWarehousesDto): Promise<Warehouse[]>;
  getWarehouseById(id: string): Promise<Warehouse | null>;
  getWarehouseByName(dto: GetWarehouseByNameDto): Promise<Warehouse | null>;
  getWarehouseByCity(dto: GetWarehousesByCityDto): Promise<Warehouse[]>;
  getWarehouseByStatus(dto: GetWarehousesByStatusDto): Promise<Warehouse[]>;
  updateWarehouse(id: string, dto: UpdateWarehouseDto): Promise<Warehouse>;
  changeWarehouseStatus(
    id: string,
    dto: ChangeWarehouseStatusDto,
  ): Promise<Warehouse>;
  deleteWarehouse(id: string): Promise<void>;
}
