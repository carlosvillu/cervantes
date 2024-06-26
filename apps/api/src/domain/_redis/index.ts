import debug from 'debug'
import type {RedisClientType} from 'redis'
import {createClient} from 'redis'
import {Repository, Schema} from 'redis-om'

const log = debug('cervantes:api:domain:redis')

const {REDIS_USER, REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_PROTOCOL} = process.env
let redisClient: RedisClientType

export class Redis {
  static create() {
    return new Redis()
  }

  async createAndConnectClient() {
    if (redisClient !== undefined) return Promise.resolve(redisClient)

    let res: Function, rej: Function

    log(`Creating a new Redis Client redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`)

    const redis = createClient({
      url: `${REDIS_PROTOCOL}://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
    })
      .on('error', error => {
        log('Connection failed', error)
        rej(error)
      })
      .on('ready', () => {
        log('Connection success')
        redisClient = redis as RedisClientType
        res(redis)
      })
    redis.connect() // eslint-disable-line 

    return new Promise((resolve, reject) => {
      res = resolve
      rej = reject
    })
  }

  repository(schema: Schema): Repository | undefined {
    if (!redisClient) return undefined

    return new Repository(schema, redisClient)
  }
}
