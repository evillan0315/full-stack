import { Injectable, Logger } from '@nestjs/common';
//import { PrismaClient as SourcePrisma } from '../../prisma/generated/source';
//import { PrismaClient as TargetPrisma } from '../../prisma/generated/target';

@Injectable()
export class MigrationService {
  //private readonly sourcePrisma = new SourcePrisma();
  //private readonly targetPrisma = new TargetPrisma();
  private readonly logger = new Logger(MigrationService.name);

  /*async migrateDocumentation(): Promise<void> {
    this.logger.log('Starting documentation migration...');

    const docs = await this.sourcePrisma.documentation.findMany();
    
    for (const doc of docs) {
      try {
        await this.targetPrisma.documentation.upsert({
          where: { id: doc.id },
          update: {
            name: doc.name ?? undefined,
            content: doc.content ?? undefined,
            // Note: no relation updates in this example to avoid conflicts
          },
          create: {
            name: doc.name ?? undefined,
            content: doc.content ?? undefined,
          },
        });
        this.logger.log(`Migrated documentation: ${doc.name}`);
      } catch (error) {
        this.logger.error(
          `Failed to migrate user ${doc.name}: ${error.message}`,
        );
      }
    }

    this.logger.log(`Migration completed: ${docs.length} docs`);
  }
  async migrateUsers(): Promise<void> {
    this.logger.log('Starting user migration...');

    const users = await this.sourcePrisma.user.findMany({
      include: {
        password: true,
        Account: true,
      },
    });
    
    for (const user of users) {
      try {
        await this.targetPrisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            emailVerified: user.emailVerified ?? undefined,
            phone_number: user.phone_number ?? undefined,
            role: user.role ?? undefined,
            deletedAt: user.deletedAt ?? undefined,
            updatedAt: user.updatedAt ?? undefined,
            // Note: no relation updates in this example to avoid conflicts
          },
          create: {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            emailVerified: user.emailVerified ?? undefined,
            phone_number: user.phone_number ?? undefined,
            role: user.role ?? undefined,
            deletedAt: user.deletedAt ?? undefined,
            createdAt: user.createdAt ?? new Date(),
            updatedAt: user.updatedAt ?? new Date(),

            password: user.password
              ? {
                  create: {
                    hash: user.password.hash,
                  },
                }
              : undefined,

            Account: user.Account?.length
              ? {
                  create: user.Account.map((acc) => ({
                    id: acc.id,
                    type: acc.type,
                    provider: acc.provider,
                    providerAccountId: acc.providerAccountId,
                    access_token: acc.access_token ?? undefined,
                    token_type: acc.token_type ?? undefined,
                    scope: acc.scope ?? undefined,
                    expires_at: acc.expires_at ?? undefined,
                    id_token: acc.id_token ?? undefined,
                    session_state: acc.session_state ?? undefined,
                  })),
                }
              : undefined,
          },
        });
        console.log(user, 'user');
        this.logger.log(`Migrated user: ${user.email}`);
      } catch (error) {
        this.logger.error(
          `Failed to migrate user ${user.email}: ${error.message}`,
        );
      }
    }

    this.logger.log(`Migration completed: ${users.length} users`);
  }
  */
  async onModuleDestroy() {
    //await this.sourcePrisma.$disconnect();
    //await this.targetPrisma.$disconnect();
  }
}
