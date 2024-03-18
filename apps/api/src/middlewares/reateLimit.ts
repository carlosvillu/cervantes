import crypto from 'crypto'

import type {Request} from 'express'
import {rateLimit} from 'express-rate-limit'
import {RedisStore} from 'rate-limit-redis'
import {RedisClientType} from 'redis'

import {Redis} from '../domain/_redis/index.js'

const ONE_HOUR = 60 * 60 * 1000
const redis = (await Redis.create().createAndConnectClient()) as RedisClientType

export const ratelimiterByUserID = (windowMs = ONE_HOUR, max = 10) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: function (req: Request) {
      const [path] = req.originalUrl.split('?')
      const hash = crypto.createHash('md5').update(path).digest('hex')

      return hash + ':' + req.user.id!
    },
    handler: function (_, res) {
      res.status(429).json({
        message: 'Too many requests, please try again later.'
      })
    },
    store: new RedisStore({
      sendCommand: async (...args: string[]) => redis.sendCommand(args)
    })
  })
