// src/migrate.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MigrationService } from './migration/migration.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(MigrationService);

  //await migrationService.migrateUsers();
  //await migrationService.migrateDocumentation();
  await app.close();
}
bootstrap();
