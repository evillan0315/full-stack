import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { UtilsModule } from './utils/utils.module';
import { ShellModule } from './shell/shell.module';
//import { MigrationService } from './migration/migration.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    MailModule,
    PrismaModule,
    UserModule,
    FileModule,
    UtilsModule,
    ShellModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
