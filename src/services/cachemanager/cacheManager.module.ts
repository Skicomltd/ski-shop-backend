import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheManagerService } from "./cacheManager.service";
import { createKeyv } from "@keyv/redis";

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                stores: [createKeyv(configService.get('cache.url'))],
                ttl: configService.get('cache.ttl'),
                isGlobal: true,
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [CacheManagerService],
    exports: [CacheManagerService],
})
export class CacheManagerModule {}