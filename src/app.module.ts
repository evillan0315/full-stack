import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
//import { RoleModule } from './role/role.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { LogModule } from './log/log.module';
import { AccountModule } from './account/account.module';
import { SchemaModule } from './schema/schema.module';
import { DocumentationModule } from './documentation/documentation.module';
import { FolderModule } from './folder/folder.module';
import { FormModule } from './form/form.module';
import { SubmissionModule } from './submission/submission.module';
import { FileModule } from './file/file.module';
import { UtilsModule } from './utils/utils.module';
import { ShellModule } from './shell/shell.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    MailModule,
    PrismaModule,
    UserModule,
    DatabaseModule,
    LogModule,
    AccountModule,
    SchemaModule,
    SubmissionModule,
    DocumentationModule,
    FolderModule,
    FormModule,
    FileModule,
    UtilsModule,
    ShellModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
