import { createCache } from 'async-cache-dedupe';
const cache = createCache({
    storage: { type: 'memory', options: { invalidation: true } }
});
export function InvalidateCache(config) {
    return function (_Target, _name, descriptor) {
        const _execute = descriptor.value;
        return Object.assign({}, {
            ...descriptor,
            value: async function (...args) {
                const model = await _execute.apply(this, args);
                if (config.name)
                    await Promise.all(config.references(args[0], model).map(async (ref) => await cache.invalidate(config.name, ref)));
                await Promise.all(config.references(args[0], model).map(async (ref) => await cache.invalidateAll(ref)));
                return model;
            }
        });
    };
}
export function Cache(config) {
    return function (_Target, _name, descriptor) {
        const _execute = descriptor.value;
        const { name, ...asyncCacheDedupeOptions } = config;
        cache.define(name, asyncCacheDedupeOptions, async function (args) {
            return _execute.call(args._self_, args);
        });
        return Object.assign({}, {
            ...descriptor,
            value: async function (params) {
                // @ts-expect-error
                const model = await cache[name]({ ...params, _self_: this });
                return model;
            }
        });
    };
}
