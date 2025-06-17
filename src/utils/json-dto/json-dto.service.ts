import { Injectable } from '@nestjs/common';
import 'reflect-metadata';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

@Injectable()
export class JsonDtoService {
  private dtoRegistry = new Map<string, Function>();

  /**
   * Register a DTO class under a given name
   */
  registerDto(name: string, dtoClass: Function): void {
    this.dtoRegistry.set(name, dtoClass);
  }

  /**
   * List registered DTO names
   */
  listDtos(): string[] {
    return Array.from(this.dtoRegistry.keys());
  }

  /**
   * Get schema for a registered DTO
   */
  getDtoSchema(name: string): Record<string, any> | null {
    const dtoClass = this.dtoRegistry.get(name);
    if (!dtoClass) return null;
    return this.toJsonSchema(dtoClass);
  }

  /**
   * Convert DTO to schema (as before, with improvements)
   */
  toJsonSchema(dto: Function): Record<string, any> {
    const prototype = dto.prototype;
    const result: Record<string, any> = { type: 'object', properties: {} };

    const props = this.getAllProperties(prototype);

    for (const prop of props) {
      const type = Reflect.getMetadata('design:type', prototype, prop);
      if (!type) continue;

      const propertySchema: any = {
        type: this.mapTypeToJsonType(type.name),
      };

      const apiMetadata = Reflect.getMetadata(
        DECORATORS.API_MODEL_PROPERTIES,
        prototype,
        prop,
      );
      if (apiMetadata) {
        if (apiMetadata.description) {
          propertySchema.description = apiMetadata.description;
        }
        if (apiMetadata.example !== undefined) {
          propertySchema.example = apiMetadata.example;
        }
      }

      result.properties[prop] = propertySchema;
    }

    return result;
  }

  private getAllProperties(prototype: object): string[] {
    const props = new Set<string>();
    let obj = prototype;
    while (obj && obj !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(obj)) {
        if (key !== 'constructor') {
          props.add(key);
        }
      }
      obj = Object.getPrototypeOf(obj);
    }
    return Array.from(props);
  }

  private mapTypeToJsonType(typeName: string | undefined): string {
    switch (typeName) {
      case 'String':
        return 'string';
      case 'Number':
        return 'number';
      case 'Boolean':
        return 'boolean';
      case 'Array':
        return 'array';
      case 'Object':
        return 'object';
      default:
        return 'string';
    }
  }
}
