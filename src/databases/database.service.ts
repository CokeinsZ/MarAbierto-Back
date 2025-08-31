// database.service.ts
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private sql: NeonQueryFunction<any, any>;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está definido en las variables de entorno');
    }
    this.sql = neon(databaseUrl);
  }

  // Uso preferido: this.db.query`SELECT * FROM users WHERE email = ${email}`
  async query<T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> {
    const rows = await (this.sql as any)(strings, ...values);
    return rows as T[];
  }

  // Para queries construidas dinámicamente con placeholders $1, $2 ...
  async unsafe<T = any>(text: string, params?: any[]): Promise<T[]> {
    const rows = await (this.sql as any).unsafe(text, params);
    return rows as T[];
  }
}