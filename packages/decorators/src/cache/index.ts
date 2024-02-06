import {createCache} from 'async-cache-dedupe'

export interface InvalidateCacheConfig<T> {
  name?: string
  references: (args: unknown, result: T) => string[]
}

export interface CacheConfig<T> {
  name: string
  ttl?: number
  references?: (args: unknown, key: string, result: T) => string[] | Promise<string[]>
}

const cache = createCache({
  storage: {type: 'memory', options: {invalidation: true}}
})

export function InvalidateCache<T>(config: InvalidateCacheConfig<T>) {
  return function (_Target: unknown, _name: string, descriptor: PropertyDescriptor) {
    const _execute = descriptor.value

    return Object.assign(
      {},
      {
        ...descriptor,
        value: async function (...args: unknown[]) {
          const model = await _execute.apply(this, args)
          if (config.name)
            await Promise.all(
              config.references(args[0], model).map(async ref => await cache.invalidate(config.name!, ref))
            )

          await Promise.all(config.references(args[0], model).map(async ref => await cache.invalidateAll(ref)))

          return model
        }
      }
    )
  }
}

export function Cache<T>(config: CacheConfig<T>) {
  return function (_Target: unknown, _name: string, descriptor: PropertyDescriptor) {
    const _execute = descriptor.value
    const {name, ...asyncCacheDedupeOptions} = config
    cache.define(name, asyncCacheDedupeOptions, async function (args: {_self_: unknown; [k: string]: unknown}) {
      return _execute.call(args._self_, args)
    })

    return Object.assign(
      {},
      {
        ...descriptor,
        value: async function (params?: unknown) {
          // @ts-expect-error
          const model = await cache[name]({...params, _self_: this})

          return model
        }
      }
    )
  }
}
