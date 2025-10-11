// database.service.ts
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private sql: NeonQueryFunction<any, any>;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL no está definido en las variables de entorno',
      );
    }
    this.sql = neon(databaseUrl);
  }

  // Uso preferido: this.db.query`SELECT * FROM users WHERE email = ${email}`
  async query<T = any>(
    strings: TemplateStringsArray,
    ...values: any[]
  ): Promise<T[]> {
    try {
      const rows = await (this.sql as any)(strings, ...values);
      return rows as T[];
    } catch (err: any) {
      // Postgres unique violation
      if (err?.code === '23505') {
        const constraint = err.constraint || '';
        const detail: string = err.detail || '';
        if (constraint.includes('email') || detail.includes('(email)'))
          throw new ConflictException('Email already exists');
        if (
          constraint.includes('national_id') ||
          detail.includes('(national_id)')
        )
          throw new ConflictException('National ID already exists');
        throw new ConflictException('Duplicate value for a unique field');
      }
      throw err;
    }
  }

  // Para queries construidas dinámicamente con placeholders $1, $2 ...
  async unsafe<T = any>(text: string, params?: any[]): Promise<T[]> {
    try {
      const rows = await (this.sql as any).query(text, params);
      return rows as T[];
    } catch (err: any) {
      // Postgres unique violation
      if (err?.code === '23505') {
        const constraint = err.constraint || '';
        const detail: string = err.detail || '';
        if (constraint.includes('email') || detail.includes('(email)'))
          throw new ConflictException('Email already exists');
        if (
          constraint.includes('national_id') ||
          detail.includes('(national_id)')
        )
          throw new ConflictException('National ID already exists');
        throw new ConflictException('Duplicate value for a unique field');
      }
      throw err;
    }
  }
}
