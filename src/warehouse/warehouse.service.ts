import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Warehouse,
  WarehouseServiceInterface,
} from './interfaces/warehouse.interface';
import { WarehouseRepository } from '../databases/repositories/warehouse/warehouse.repository';
import {
  CreateWarehouseDto,
  ListWarehousesDto,
  GetWarehouseByNameDto,
  GetWarehousesByCityDto,
  GetWarehousesByStatusDto,
  UpdateWarehouseDto,
  ChangeWarehouseStatusDto,
} from './dtos/warehouse.dto';

@Injectable()
export class WarehouseService implements WarehouseServiceInterface {
  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  async createWarehouse(dto: CreateWarehouseDto): Promise<Warehouse> {
    const existing = await this.warehouseRepository.getWarehouseByName({
      name: dto.name,
    } as GetWarehouseByNameDto);
    if (existing && existing.name.toLowerCase() === dto.name.toLowerCase()) {
      throw new BadRequestException('Warehouse with this name already exists');
    }
    const created = await this.warehouseRepository.createWarehouse(dto);
    if (!created) throw new BadRequestException('Warehouse creation failed');
    return this.toWarehouseInterface(created);
  }

  async listWarehouses(dto: ListWarehousesDto): Promise<Warehouse[]> {
    const page = dto.page && dto.max ? (dto.page - 1) * dto.max : 0;
    dto.page = page;
    const warehouses = await this.warehouseRepository.listWarehouses(dto);
    return warehouses.map((w) => this.toWarehouseInterface(w));
  }

  async getWarehouseById(id: string): Promise<Warehouse | null> {
    const warehouse = await this.warehouseRepository.getWarehouseById(id);
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return this.toWarehouseInterface(warehouse);
  }

  async getWarehouseByName(
    dto: GetWarehouseByNameDto,
  ): Promise<Warehouse | null> {
    const warehouse = await this.warehouseRepository.getWarehouseByName(dto);
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return this.toWarehouseInterface(warehouse);
  }

  async getWarehouseByCity(dto: GetWarehousesByCityDto): Promise<Warehouse[]> {
    const warehouses = await this.warehouseRepository.getWarehousesByCity(dto);
    return warehouses.map((w) => this.toWarehouseInterface(w));
  }

  async getWarehouseByStatus(
    dto: GetWarehousesByStatusDto,
  ): Promise<Warehouse[]> {
    const warehouses =
      await this.warehouseRepository.getWarehousesByStatus(dto);
    return warehouses.map((w) => this.toWarehouseInterface(w));
  }

  async updateWarehouse(
    id: string,
    dto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    const existing = await this.warehouseRepository.getWarehouseById(id);
    if (!existing) throw new NotFoundException('Warehouse not found');

    const updated = await this.warehouseRepository.updateWarehouse(id, dto);
    return this.toWarehouseInterface(updated);
  }

  async changeWarehouseStatus(
    id: string,
    dto: ChangeWarehouseStatusDto,
  ): Promise<Warehouse> {
    const existing = await this.warehouseRepository.getWarehouseById(id);
    if (!existing) throw new NotFoundException('Warehouse not found');

    const updated = await this.warehouseRepository.changeWarehouseStatus(
      id,
      dto,
    );
    return this.toWarehouseInterface(updated);
  }

  async deleteWarehouse(id: string): Promise<void> {
    await this.warehouseRepository.deleteWarehouse(id);
  }

  private toWarehouseInterface(w: any): Warehouse {
    return {
      id: (w.warehouse_id ?? w.id ?? w._id).toString(),
      name: w.name,
      city: w.city,
      address: w.address,
      status: w.status,
    };
  }
}
