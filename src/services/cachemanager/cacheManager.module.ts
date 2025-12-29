import { CacheModule } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { CacheManagerService } from "./cacheManager.service"
import { createKeyv } from "@keyv/redis"
import cacheConfig, { IRedisConfig } from "../../config/redis.config"

@Module({
  imports: [
    ConfigModule.forFeature(cacheConfig),
    CacheModule.registerAsync({
      imports: [ConfigModule.forFeature(cacheConfig)],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<IRedisConfig>("redis")

        return {
          stores: [createKeyv(config.url)],
          ttl: config.ttl,
          isGlobal: true
        }
      },
      inject: [ConfigService]
    })
  ],
  providers: [CacheManagerService],
  exports: [CacheManagerService]
})
export class CacheManagerModule {}
