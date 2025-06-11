// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/src/app.module.ts

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
import { SetupModule } from './setup/setup.module';
import { ScreenRecorderModule } from './screen-recorder/screen-recorder.module';
import { AwsModule } from './aws/aws.module';

import fileConfig from './config/file.config';

/**
 * The root module of the NestJS application.
 *
 * This module imports and organizes all the other modules within the application.
 * It also configures global settings like static file serving and configuration loading.
 */
@Module({
  imports: [
    /**
     * Authentication module for handling user authentication and authorization.
     */
    AuthModule,

    /**
     * Module for sending emails.
     */
    MailModule,

    /**
     * Prisma module for database access using Prisma ORM.
     */
    PrismaModule,

    /**
     * Module for managing user-related operations.
     */
    UserModule,

    /**
     * Module for handling file storage and retrieval.
     */
    FileModule,

    /**
     * Module containing utility functions.
     */
    UtilsModule,

    /**
     * Module for database-related operations.
     */
    DatabaseModule,

    /**
     * Module for interacting with the terminal.
     */
    TerminalModule,

    /**
     * Module for managing folders.
     */
    FolderModule,

    /**
     * Module for Google-related services (e.g., OAuth).
     */
    GoogleModule,

    /**
     * Module for schema management.
     */
    SchemaModule,

    /**
     * Module for logging application events.
     */
    LogModule,

    /**
     * Module for audio processing and management.
     */
    AudioModule,

    /**
     * Configuration module for loading environment variables and configurations.
     *
     * `isGlobal: true` makes this module available throughout the application without needing to import it in other modules.
     * `load: [fileConfig]` loads the file configuration from './config/file.config'.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      load: [fileConfig],
    }),

    /**
     * Module for serving static files (e.g., images, CSS, JavaScript).
     *
     * `rootPath` specifies the directory containing the static files (in this case, 'assets').
     * `serveRoot` specifies the URL path under which the static files will be served (in this case, '/assets').
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'), // Absolute path to the static files
      serveRoot: '/assets', // URL path where the assets are served
    }),
    /**
     * Module for initial setup and configuration.
     */
    SetupModule,
    /**
     * Module for screen recording functionality.
     */
    ScreenRecorderModule,
    AwsModule,
  ],
  /**
   * Controllers defined in this module.  Controllers handle incoming requests and route them to appropriate handlers.
   */
  controllers: [AppController],

  /**
   * Providers defined in this module. Providers offer services or functionality that can be injected into controllers and other providers.
   */
  providers: [AppService, GoogleOAuthService],
})
export class AppModule {}
