import { DynamicModule, Module } from "@nestjs/common"

import { FezService } from "./fez.service"
import { FEZ_CONFIG_OPTIONS } from "./entities/config"
import { FezModuleAsynOptions, FezModuleOptions } from "./interfaces/config.interface"
import { HttpModule } from "@nestjs/axios"

@Module({})
export class FezModule {
  static register(config: FezModuleOptions): DynamicModule {
    return {
      imports: [HttpModule],
      module: FezModule,
      providers: [
        FezService,
        {
          provide: FEZ_CONFIG_OPTIONS,
          useValue: config
        }
      ],
      exports: [FEZ_CONFIG_OPTIONS, FezService]
    }
  }

  static registerAsync(config: FezModuleAsynOptions): DynamicModule {
    return {
      module: FezModule,
      imports: [...(config.imports || []), HttpModule],
      providers: [
        {
          provide: FEZ_CONFIG_OPTIONS,
          useFactory: config.useFactory,
          inject: config.inject || []
        },
        FezService
      ],
      exports: [FezService, FEZ_CONFIG_OPTIONS]
    }
  }
}
