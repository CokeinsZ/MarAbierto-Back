import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

export interface SecurityCode {
  user_id: number;
  code: string;
  created_at: Date;
  expires_at: Date;
}

@Injectable()
export class SecurityCodesRepository {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Crea o reemplaza el código de seguridad para un usuario (upsert). expiration time por defecto 10 minutos.
   */
  async create(userId: number, code: string, expirationTime = 10): Promise<SecurityCode> {
    const rows = await this.db.query<SecurityCode>`
      INSERT INTO securitycodes (user_id, code, expires_at)
      VALUES (${userId}, ${code}, NOW() + (${expirationTime} || ' minutes')::interval)
      ON CONFLICT (user_id) DO UPDATE
        SET code = EXCLUDED.code,
            created_at = NOW(),
            expires_at = NOW() + (${expirationTime} || ' minutes')::interval
      RETURNING *`;
    return rows[0];
  }

  async find(userId: number): Promise<SecurityCode | null> {
    const rows = await this.db.query<SecurityCode>`SELECT * FROM securitycodes WHERE user_id = ${userId}`;
    return rows[0] || null;
  }

  async update(userId: number, code: string, expirationTime = 10): Promise<SecurityCode> {
    // reutiliza create
    return this.create(userId, code, expirationTime);
  }

  async erase(userId: number): Promise<void> {
    await this.db.query`DELETE FROM securitycodes WHERE user_id = ${userId}`;
  }

  async purgeExpired(): Promise<number> {
    const rows = await this.db.query<{ deleted: number }>`
      WITH deleted AS (
        DELETE FROM securitycodes WHERE expires_at < NOW() RETURNING 1
      )
      SELECT COUNT(*)::int AS deleted FROM deleted`;
    return rows[0]?.deleted ?? 0;
  }
}
