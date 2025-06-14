export interface InvalidateCacheConfig<T> {
    name?: string;
    references: (args: unknown, result: T) => string[];
}
export interface CacheConfig<T> {
    name: string;
    ttl?: number;
    references?: (args: unknown, key: string, result: T) => string[] | Promise<string[]>;
}
export declare function InvalidateCache<T>(config: InvalidateCacheConfig<T>): (_Target: unknown, _name: string, descriptor: PropertyDescriptor) => {
    value: (...args: unknown[]) => Promise<any>;
    configurable?: boolean;
    enumerable?: boolean;
    writable?: boolean;
    get?(): any;
    set?(v: any): void;
};
export declare function Cache<T>(config: CacheConfig<T>): (_Target: unknown, _name: string, descriptor: PropertyDescriptor) => {
    value: (params?: unknown) => Promise<any>;
    configurable?: boolean;
    enumerable?: boolean;
    writable?: boolean;
    get?(): any;
    set?(v: any): void;
};
