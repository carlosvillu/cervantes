/* eslint @typescript-eslint/no-misused-promises:0 */
import debug from 'debug'
import express, {Request, Response} from 'express'
import bearerToken from 'express-bearer-token'
import fileUpload from 'express-fileupload'
import {createHttpTerminator} from 'http-terminator'
import pino from 'pino-http'
import type {RedisClientType} from 'redis'
import {ulid} from 'ulid'

import healthCheckMiddleware from '@crdtech/express-health-check-middleware'

import {Redis} from './domain/_redis/index.js'
import {domain} from './middlewares/domain.js'
import {router as authRouter} from './routes/auth/index.js'
import {router as bodyRouter} from './routes/body/index.js'
import {router as bookRouter} from './routes/book/index.js'
import {router as chapterRouter} from './routes/chapter/index.js'
import {router as linkRouter} from './routes/link/index.js'
import {router as uploadRouter} from './routes/upload/index.js'
import {router as userRouter} from './routes/user/index.js'

const {PORT, HOST, STAGE} = process.env
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
app.use(fileUpload())
app.use(healthCheckMiddleware()(app))
STAGE === 'production' &&
  app.use(
    // @ts-expect-error
    pino({
      // Define a custom request id function
      genReqId: function (req: Request, res: Response) {
        const existingID = req.id ?? req.headers['x-request-id']
        if (existingID) return existingID
        const id = ulid()
        res.setHeader('X-Request-Id', id)
        return id
      }
    })
  )
app.use(domain)

// CORS
app.use(function (req, res, next) {
  const ALLOW_ORIGINS = ['localhost', 'cervantes-editor.fly.dev', 'editor.bookadventur.es']
  if (ALLOW_ORIGINS.some(origin => req.header('origin')?.includes(origin))) {
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
app.use('/link', linkRouter)
app.use('/body', bodyRouter)
app.use('/upload', uploadRouter)

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
