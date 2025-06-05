import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { UtilsModule } from './utils/utils.module';
import { DatabaseModule } from './database/database.module';
import { TerminalModule } from './terminal/terminal.module';
import { FolderModule } from './folder/folder.module';
import { GoogleModule } from './google/google.module';
import { GoogleOAuthService } from './google/google-oauth/google-oauth.service';
import { SchemaModule } from './schema/schema.module';
import { LogModule } from './log/log.module';
import { AudioModule } from './audio/audio.module';

import fileConfig from './config/file.config';

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
    SchemaModule,
    LogModule,
    AudioModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make config available globally
      load: [fileConfig],
    }),
    ServeStaticModule.forRoot({
      // This line is crucial for serving static files
      rootPath: join(__dirname, '..', 'assets'), // Points to the 'assets' folder
      serveRoot: '/assets', // The URL prefix for static files (e.g., /assets/project-board.css)
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleOAuthService],
})
export class AppModule {}
