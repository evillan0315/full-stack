import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { UtilsModule } from './utils/utils.module';

//import { MigrationService } from './migration/migration.service';
import { DatabaseModule } from './database/database.module';
import { TerminalModule } from './terminal/terminal.module';
import { FolderModule } from './folder/folder.module';
import { GoogleModule } from './google/google.module';
import { GoogleOAuthService } from './google/google-oauth/google-oauth.service';

@Module({
  imports: [
    AuthModule,
    MailModule,
    PrismaModule,
    UserModule,
    FileModule,
    UtilsModule,
    DatabaseModule,
    TerminalModule,
    FolderModule,
    GoogleModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleOAuthService],
})
export class AppModule {}
