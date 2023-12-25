import debug from 'debug'
import jwt from 'jsonwebtoken'

import {findUserByID} from '../../models/user'

const log = debug('cervantes:api:middlewares:auth')

const {ACCESS_TOKEN_PRIVATE_KEY} = process.env

async function auth(req, res, next) {
  try {
    const accessToken = req.token
    log('Auth', accessToken)
    if (accessToken === undefined)
      return res.status(401).json({error: true, message: '401 Unauthorized'})

    jwt.verify(accessToken, ACCESS_TOKEN_PRIVATE_KEY, async (err, data) => {
      if (err !== undefined)
        return res.status(403).json({error: true, message: '403 Forbidden'})

      const user = await findUserByID(data.userID)
      req.user = user
      next()
    })
  } catch (err) {
    debug('Auth FAILED')
    res.status(500).json({error: true, message: 'Internal Server Error'})
  }
}

module.exports = {auth}
