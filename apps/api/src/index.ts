/* eslint @typescript-eslint/no-misused-promises:0 */
import debug from 'debug'
import express from 'express'
import bearerToken from 'express-bearer-token'
import {createHttpTerminator} from 'http-terminator'
import type {RedisClientType} from 'redis'

import healthCheckMiddleware from '@crdtech/express-health-check-middleware'

import {Redis} from './domain/_redis/index.js'
import {domain} from './middlewares/domain.js'
import {router as authRouter} from './routes/auth/index.js'
import {router as bookRouter} from './routes/book/index.js'
import {router as chapterRouter} from './routes/chapter/index.js'
import {router as userRouter} from './routes/user/index.js'

const {PORT, HOST} = process.env
const log = debug('cervantes:api:server')

log(`
================================================
🌏 Stage: ${process.env.STAGE ?? 'UNKOWN'}
🌏 ENV: ${process.env.NODE_ENV ?? 'UNKOWN'}
================================================
`)

const redis = (await Redis.create().createAndConnectClient()) as RedisClientType
const app = express()

app.use(bearerToken())
app.use(express.json())
app.use(healthCheckMiddleware()(app))
app.use(domain)

// CORS
app.use(function (req, res, next) {
  if (req.header('origin')?.includes('localhost')) {
    res.setHeader('Access-Control-Allow-Origin', req.get('origin')!)
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  }
  next()
})

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/book', bookRouter)
app.use('/chapter', chapterRouter)

const server = app.listen(+PORT!, HOST!, () => log('app Listen in:', `http://${HOST!}:${PORT!}`)) // eslint-disable-line 

const httpTerminator = createHttpTerminator({server})

process.on('SIGTERM', async function () {
  // eslint-disable-line
  log('SIGTERM signal received: closing HTTP app')
  await redis.quit()
  await httpTerminator.terminate()
  log('HTTP app closed')
  process.exit(0)
})
