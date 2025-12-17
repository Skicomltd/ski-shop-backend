// config/cache.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('CACHE', () => ({
  URL: process.env.REDIS_URL,
  TTL: parseInt(process.env.CACHE_TTL, 10) || 3600,
}));