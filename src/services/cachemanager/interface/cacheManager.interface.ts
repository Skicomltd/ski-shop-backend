export interface ICacheManager {
    get<T = any>(key: string): Promise<T | undefined>;
    set<T = any>(key: string, data: T, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
}