```typescript
// src/module-control/module-control.service.ts
import { Injectable, Logger } from '@nestjs/common';

/**
 * Title: NestJS Module control service
 * Interface for a configurable module.
 * In a real application, you might define more properties
 * like description, dependencies, etc.
 */
export interface ConfigurableModule {
  name: string;
  enabled: boolean;
}

@Injectable()
export class ModuleControlService {
  private readonly logger = new Logger(ModuleControlService.name);
  // A map to store the status of "configurable" modules.
  // The key is the module name, the value is its ConfigurableModule object.
  private modules: Map<string, ConfigurableModule> = new Map();

  constructor() {
    this.logger.log('ModuleControlService initialized.');
    // In a real application, you might load initial module states
    // from a database, environment variables, or a configuration file.
    // For this example, we'll start with some predefined modules.
    this.registerModule('FeatureA', true); // FeatureA is enabled by default
    this.registerModule('FeatureB', false); // FeatureB is disabled by default
    this.registerModule('AnalyticsModule', true); // AnalyticsModule is enabled by default
  }

  /**
   * Registers a module with the control service.
   * This is where you would conceptually "read" about a module
   * and add it to your management system.
   * @param name The name of the module to register.
   * @param initialStatus The initial enabled status of the module.
   */
  registerModule(name: string, initialStatus: boolean = false): void {
    if (this.modules.has(name)) {
      this.logger.warn(`Module '${name}' is already registered.`);
      return;
    }
    this.modules.set(name, { name, enabled: initialStatus });
    this.logger.log(`Module '${name}' registered with initial status: ${initialStatus ? 'enabled' : 'disabled'}.`);
  }

  /**
   * Enables a specific module.
   * @param name The name of the module to enable.
   * @returns True if the module was found and enabled, false otherwise.
   */
  enableModule(name: string): boolean {
    const module = this.modules.get(name);
    if (module) {
      module.enabled = true;
      this.logger.log(`Module '${name}' enabled.`);
      return true;
    }
    this.logger.warn(`Module '${name}' not found for enabling.`);
    return false;
  }

  /**
   * Disables a specific module.
   * @param name The name of the module to disable.
   * @returns True if the module was found and disabled, false otherwise.
   */
  disableModule(name: string): boolean {
    const module = this.modules.get(name);
    if (module) {
      module.enabled = false;
      this.logger.log(`Module '${name}' disabled.`);
      return true;
    }
    this.logger.warn(`Module '${name}' not found for disabling.`);
    return false;
  }

  /**
   * Toggles the enabled status of a specific module.
   * @param name The name of the module to toggle.
   * @returns The new status of the module, or undefined if not found.
   */
  toggleModule(name: string): boolean | undefined {
    const module = this.modules.get(name);
    if (module) {
      module.enabled = !module.enabled;
      this.logger.log(`Module '${name}' toggled to: ${module.enabled ? 'enabled' : 'disabled'}.`);
      return module.enabled;
    }
    this.logger.warn(`Module '${name}' not found for toggling.`);
    return undefined;
  }

  /**
   * Checks if a module is currently enabled.
   * @param name The name of the module to check.
   * @returns True if the module is enabled, false if disabled or not registered.
   */
  isModuleEnabled(name: string): boolean {
    const module = this.modules.get(name);
    const status = module ? module.enabled : false;
    this.logger.debug(`Checking status for '${name}': ${status ? 'enabled' : 'disabled'}.`);
    return status;
  }

  /**
   * Gets the status of all registered modules.
   * @returns An array of configurable module states.
   */
  getAllModuleStatuses(): ConfigurableModule[] {
    return Array.from(this.modules.values());
  }
}
```


```typescript
// src/module-control/module-control.module.ts
import { Module } from '@nestjs/common';
import { ModuleControlService } from './module-control.service';

@Module({
  providers: [ModuleControlService],
  exports: [ModuleControlService], // Export the service so other modules can use it
})
export class ModuleControlModule {}
```


```typescript
// src/feature/feature.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ModuleControlService } from '../module-control/module-control.service';

@Injectable()
export class FeatureService {
  private readonly logger = new Logger(FeatureService.name);

  constructor(private readonly moduleControlService: ModuleControlService) {}

  /**
   * This method performs a feature-specific action, but only if
   * 'FeatureA' is considered enabled by the ModuleControlService.
   */
  performFeatureAction(): string {
    if (this.moduleControlService.isModuleEnabled('FeatureA')) {
      this.logger.log('Performing Feature A action because it is enabled.');
      return 'Feature A functionality is active and executed!';
    } else {
      this.logger.warn('Feature A is disabled. Action not performed.');
      return 'Feature A functionality is currently disabled.';
    }
  }

  /**
   * This method performs a feature-specific action, but only if
   * 'FeatureB' is considered enabled by the ModuleControlService.
   */
  performAnotherFeatureAction(): string {
    if (this.moduleControlService.isModuleEnabled('FeatureB')) {
      this.logger.log('Performing Feature B action because it is enabled.');
      return 'Feature B functionality is active and executed!';
    } else {
      this.logger.warn('Feature B is disabled. Action not performed.');
      return 'Feature B functionality is currently disabled.';
    }
  }
}
```


```typescript
// src/feature/feature.controller.ts
import { Controller, Get, Param, BadRequestException, Logger } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { ModuleControlService } from '../module-control/module-control.service';

@Controller('feature')
export class FeatureController {
  private readonly logger = new Logger(FeatureController.name);

  constructor(
    private readonly featureService: FeatureService,
    private readonly moduleControlService: ModuleControlService, // Inject the control service
  ) {}

  @Get('action-a')
  getActionA(): string {
    return this.featureService.performFeatureAction();
  }

  @Get('action-b')
  getActionB(): string {
    return this.featureService.performAnotherFeatureAction();
  }

  // --- API Endpoints to control module status at runtime ---

  @Get('status/:moduleName')
  getModuleStatus(@Param('moduleName') moduleName: string): { module: string; enabled: boolean } {
    const enabled = this.moduleControlService.isModuleEnabled(moduleName);
    this.logger.log(`Requested status for '${moduleName}': ${enabled}`);
    return { module: moduleName, enabled };
  }

  @Get('enable/:moduleName')
  enableModule(@Param('moduleName') moduleName: string): { message: string; module: string; status: boolean } {
    const success = this.moduleControlService.enableModule(moduleName);
    if (!success) {
      throw new BadRequestException(`Module '${moduleName}' could not be enabled.`);
    }
    const newStatus = this.moduleControlService.isModuleEnabled(moduleName);
    return { message: `Module '${moduleName}' enabled successfully.`, module: moduleName, status: newStatus };
  }

  @Get('disable/:moduleName')
  disableModule(@Param('moduleName') moduleName: string): { message: string; module: string; status: boolean } {
    const success = this.moduleControlService.disableModule(moduleName);
    if (!success) {
      throw new BadRequestException(`Module '${moduleName}' could not be disabled.`);
    }
    const newStatus = this.moduleControlService.isModuleEnabled(moduleName);
    return { message: `Module '${moduleName}' disabled successfully.`, module: moduleName, status: newStatus };
  }

  @Get('toggle/:moduleName')
  toggleModule(@Param('moduleName') moduleName: string): { message: string; module: string; status: boolean } {
    const newStatus = this.moduleControlService.toggleModule(moduleName);
    if (newStatus === undefined) {
      throw new BadRequestException(`Module '${moduleName}' not found for toggling.`);
    }
    return { message: `Module '${moduleName}' toggled.`, module: moduleName, status: newStatus };
  }

  @Get('all-statuses')
  getAllStatuses(): ConfigurableModule[] {
    return this.moduleControlService.getAllModuleStatuses();
  }
}
```


```typescript
// src/feature/feature.module.ts
import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { ModuleControlModule } from '../module-control/module-control.module'; // Import the control module

@Module({
  imports: [ModuleControlModule], // Make ModuleControlService available here
  providers: [FeatureService],
  controllers: [FeatureController],
})
export class FeatureModule {}
```


```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeatureModule } from './feature/feature.module';
import { ModuleControlModule } from './module-control/module-control.module';

@Module({
  imports: [
    ModuleControlModule, // Import your module control system
    FeatureModule,       // Import the feature module that uses the control system
    // ... other modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
