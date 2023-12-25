import debug from 'debug'
import express from 'express'
import bearerToken from 'express-bearer-token'
import {createHttpTerminator} from 'http-terminator'

import healthCheckMiddleware from '@crdtech/express-health-check-middleware'

const {PORT, HOST} = process.env
const log = debug('cervantes:api:server')

const app = express()

app.use(bearerToken())
app.use(express.json())
app.use(healthCheckMiddleware()(app))

app.get('/', (req, res) => {
  res.send('Hola')
})

const server = app.listen(+PORT!, HOST!, () => log('app Listen in:', `http://${HOST!}:${PORT!}`)) // eslint-disable-line 

const httpTerminator = createHttpTerminator({server})

process.on('SIGTERM', async function () { // eslint-disable-line  
  log('SIGTERM signal received: closing HTTP app')
  await httpTerminator.terminate()
  log('HTTP app closed')
  process.exit(0)
})
