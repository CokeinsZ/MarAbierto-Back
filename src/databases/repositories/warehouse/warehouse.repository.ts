import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { Warehouse } from '../../../warehouse/interfaces/warehouse.interface';
import {
  CreateWarehouseDto,
  ChangeWarehouseStatusDto,
  GetWarehouseByNameDto,
  GetWarehousesByCityDto,
  GetWarehousesByStatusDto,
  ListWarehousesDto,
  UpdateWarehouseDto,
} from 'src/warehouse/dtos/warehouse.dto';

@Injectable()
export class WarehouseRepository {
  constructor(private readonly db: DatabaseService) {}

  async createWarehouse(dto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.db.query<Warehouse>`
      INSERT INTO warehouse (name, city, address, status)
      VALUES (${dto.name}, ${dto.city}, ${dto.address}, ${dto.status || 'active'})
      RETURNING *`;
    return warehouse[0];
  }

  async listWarehouses(dto: ListWarehousesDto): Promise<Warehouse[]> {
    const warehouses = await this.db.query<Warehouse>`
      SELECT * FROM warehouse
      LIMIT ${dto.max} OFFSET ${dto.page}`;
    return warehouses;
  }

  async getWarehouseById(id: string): Promise<Warehouse | null> {
    const warehouse = await this.db.query<Warehouse>`
      SELECT * FROM warehouse WHERE warehouse_id = ${id}`;
    return warehouse[0] || null;
  }

  async getWarehouseByName(
    dto: GetWarehouseByNameDto,
  ): Promise<Warehouse | null> {
    const warehouse = await this.db.query<Warehouse>`
      SELECT * FROM warehouse WHERE unaccent(name) ILIKE '%' || unaccent(${dto.name}) || '%'`;
    return warehouse[0] || null;
  }

  async getWarehousesByCity(dto: GetWarehousesByCityDto): Promise<Warehouse[]> {
    const warehouses = await this.db.query<Warehouse>`
      SELECT * FROM warehouse WHERE unaccent(city) ILIKE '%' || unaccent(${dto.city}) || '%'`;
    return warehouses;
  }

  async getWarehousesByStatus(
    dto: GetWarehousesByStatusDto,
  ): Promise<Warehouse[]> {
    const warehouses = await this.db.query<Warehouse>`
      SELECT * FROM warehouse WHERE status = ${dto.status}`;
    return warehouses;
  }

  async updateWarehouse(
    id: string,
    dto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    const keys = Object.keys(dto);
    if (keys.length === 0) {
      throw new BadRequestException(
        "No fields to update. (You can't update the id)",
      );
    }
    const setClauses: string[] = [];
    const values: any[] = [];
    keys.forEach((k, idx) => {
      setClauses.push(`${k} = $${idx + 1}`);
      values.push((dto as any)[k]);
    });
    // WHERE param position is next
    const whereIndex = values.length + 1;
    const sql = `UPDATE warehouse SET ${setClauses.join(', ')} WHERE warehouse_id = $${whereIndex} RETURNING *`;
    values.push(id);
    const rows = await this.db.unsafe<Warehouse>(sql, values);
    return rows[0];
  }

  async changeWarehouseStatus(
    id: string,
    dto: ChangeWarehouseStatusDto,
  ): Promise<Warehouse> {
    const result = await this.db.query<Warehouse>`
      UPDATE warehouse
      SET status = ${dto.status}
      WHERE warehouse_id = ${id}
      RETURNING *`;
    return result[0];
  }

  async deleteWarehouse(id: string): Promise<void> {
    await this.db.query`
      DELETE FROM warehouse WHERE warehouse_id = ${id}`;
  }
}
