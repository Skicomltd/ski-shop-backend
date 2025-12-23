import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheManagerService } from "./cacheManager.service";
import { createKeyv } from "@keyv/redis";
import cacheConfig from "./entities/config";
import { ICacheConfig } from "./interface/cacheManager.interface";

@Module({
    imports: [
        ConfigModule.forFeature(cacheConfig),
        CacheModule.registerAsync({
            imports: [ConfigModule.forFeature(cacheConfig)],
            useFactory: async (configService: ConfigService) => {
                const config = configService.get<ICacheConfig>('cache');
                
                return {
                    stores: [createKeyv(config.url)],
                    ttl: config.ttl,
                    isGlobal: true,
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [CacheManagerService],
    exports: [CacheManagerService],
})
export class CacheManagerModule {}