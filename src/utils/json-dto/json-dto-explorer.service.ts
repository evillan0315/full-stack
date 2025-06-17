import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import {
  ROUTE_ARGS_METADATA,
  PATH_METADATA,
  METHOD_METADATA,
} from '@nestjs/common/constants';
import {
  JsonDtoEndpointDto,
  JsonDtoEndpointQueryParamDto,
  JsonDtoEndpointResponseDto,
} from './dto/json-dto-endpoint.dto';

@Injectable()
export class JsonDtoExplorerService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  getEndpoints(): JsonDtoEndpointDto[] {
    const controllers = this.discoveryService.getControllers();
    const routes: JsonDtoEndpointDto[] = [];

    for (const wrapper of controllers) {
      const instance = wrapper.instance;
      if (!instance) continue;

      const controllerPath = this.reflector.get<string>(
        PATH_METADATA,
        instance.constructor,
      );
      if (!controllerPath || !controllerPath.startsWith('json-dto')) continue;

      const proto = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(proto).filter(
        (name) =>
          typeof instance[name] === 'function' && name !== 'constructor',
      );

      for (const methodName of methodNames) {
        const methodRef = instance[methodName];

        const routePath = this.reflector.get<string | string[]>(
          PATH_METADATA,
          methodRef,
        );
        const methodType = this.reflector.get<string>(
          METHOD_METADATA,
          methodRef,
        );

        const fullPath = this.buildFullPath(controllerPath, routePath);

        const routeArgs =
          this.reflector.get<any>(ROUTE_ARGS_METADATA, methodRef) || {};
        const queryParams: JsonDtoEndpointQueryParamDto[] = Object.values(
          routeArgs,
        )
          .filter((arg: any) => arg?.type === 'query')
          .map((arg: any) => ({
            name: arg.data,
            required: false,
            description: '',
          }));

        const apiResponses = this.reflector.getAllAndMerge(
          'swagger/apiResponse',
          [methodRef, instance.constructor],
        );
        const responses: JsonDtoEndpointResponseDto[] = Array.isArray(
          apiResponses,
        )
          ? apiResponses.map((resp) => ({
              status: resp.status || 200,
              description: resp.description || '',
              schema: resp.schema || {},
            }))
          : [];

        const apiOperation: any[] =
          this.reflector.getAllAndMerge('swagger/apiOperation', [methodRef]) ||
          [];

        const description: string = apiOperation[0]?.summary || '';

        routes.push({
          method:
            typeof methodType === 'string'
              ? methodType.toUpperCase()
              : 'UNKNOWN',
          path: fullPath,
          queryParams,
          description,
          responses,
        });
      }
    }

    return routes;
  }

  private buildFullPath(
    controllerPath: string,
    routePath: string | string[] | undefined,
  ): string {
    let fullPath = `/${controllerPath}`;
    if (routePath) {
      const path = Array.isArray(routePath) ? routePath[0] : routePath;
      if (path) {
        fullPath += `/${path}`;
      }
    }
    return fullPath.replace(/\/+/g, '/');
  }
}
