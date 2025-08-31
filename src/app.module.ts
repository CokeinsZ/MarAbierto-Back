import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { DatabaseModule } from './databases/database.module';
import { DatabaseService } from './databases/database.service';
import { PoliciesGuard } from './tools/guards/policies.guard';
import { JwtAuthGuard } from './tools/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './tools/guards/roles.guard';
import { AbilitiesModule } from './tools/abilities/abilities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AbilitiesModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    DatabaseService,
  ],
})
export class AppModule {}
