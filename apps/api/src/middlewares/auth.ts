/* eslint @typescript-eslint/no-misused-promises: 0 */

import debug from 'debug'
import type {RequestHandler} from 'express'
import jwt from 'jsonwebtoken'

const log = debug('cervantes:api:middlewares:auth')

interface Payload {
  userID: string
  token: string
  createdAt: Date
}

const {ACCESS_TOKEN_PRIVATE_KEY = ''} = process.env

const auth: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = req.token
    log('Auth', accessToken)
    if (accessToken === undefined) return res.status(401).json({error: true, message: '401 Unauthorized'})

    jwt.verify(accessToken, ACCESS_TOKEN_PRIVATE_KEY, async (err, data) => {
      if (err !== undefined) return res.status(403).json({error: true, message: '403 Forbidden'})

      const user = await findUserByID((data as Payload).userID)
      req.user = user
      next()
    })
  } catch (err) {
    debug('Auth FAILED')
    res.status(500).json({error: true, message: 'Internal Server Error'})
  }
}

module.exports = {auth}
