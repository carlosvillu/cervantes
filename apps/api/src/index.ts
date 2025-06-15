/* eslint @typescript-eslint/no-misused-promises:0 */
import debug from 'debug'
import express, {Request, Response} from 'express'
import bearerToken from 'express-bearer-token'
import fileUpload from 'express-fileupload'
import {createHttpTerminator} from 'http-terminator'
import pino from 'pino-http'
import type {RedisClientType} from 'redis'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {ulid} from 'ulid'
import {readFileSync} from 'fs'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import yaml from 'js-yaml'

import healthCheckMiddleware from '@crdtech/express-health-check-middleware'

import {Redis} from './domain/_redis/index.js'
import {cors} from './middlewares/cors.js'
import {domain} from './middlewares/domain.js'
import {router as authRouter} from './routes/auth/index.js'
import {router as bodyRouter} from './routes/body/index.js'
import {router as bookRouter} from './routes/book/index.js'
import {router as chapterRouter} from './routes/chapter/index.js'
import {router as imageRouter} from './routes/image/index.js'
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

// Load OpenAPI specification
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const openApiPath = join(__dirname, '..', 'openapi.yaml')
const openApiSpec = yaml.load(readFileSync(openApiPath, 'utf8')) as object

const redis = (await Redis.create().createAndConnectClient()) as RedisClientType
const app = express()

app.use('/upload', bearerToken(), domain(), cors(), fileUpload(), uploadRouter)
app.use(healthCheckMiddleware()(app))

// Swagger UI setup
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Cervantes API Documentation'
  })
)

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
app.use(bearerToken())
app.use(express.json())
app.use(domain())
app.use(cors())

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/book', bookRouter)
app.use('/chapter', chapterRouter)
app.use('/link', linkRouter)
app.use('/body', bodyRouter)
app.use('/image', imageRouter)

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
