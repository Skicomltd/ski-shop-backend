import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { ICacheManager } from "./interface/cacheManager.interface";

@Injectable()
export class CacheManagerService implements ICacheManager {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

 async get<T = any>(key: string): Promise<T | undefined> {
        return await this.cacheManager.get<T>(key);
    }

    async set<T = any>(key: string, data: T, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, data, ttl);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}