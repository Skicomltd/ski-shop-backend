import { registerAs } from "@nestjs/config"
import { ICacheConfig } from "../interface/cacheManager.interface"

export default registerAs(
  "cache",
  (): ICacheConfig => ({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    ttl: parseInt(process.env.CACHE_DEFAULT_TTL, 10) || 30 * 60 * 1000 // 30 minutes
  })
)
