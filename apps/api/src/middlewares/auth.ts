/* eslint @typescript-eslint/no-misused-promises: 0 */

import debug from 'debug'
import type {NextFunction, Request, Response} from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'

const log = debug('cervantes:api:middlewares:auth')

interface Payload {
  id: string
  token: string
  createdAt: Date
}

const {ACCESS_TOKEN_PRIVATE_KEY = ''} = process.env
function isPayload(data: JwtPayload | string | undefined): data is Payload {
  return (data as Payload).id !== undefined
}

export const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const access = req.token
    log('Auth token ->', access)
    if (access === undefined) return res.status(401).json({error: true, message: '401 Unauthorized'})

    jwt.verify(access, ACCESS_TOKEN_PRIVATE_KEY, async (err, data) => {
      log('JWT payload %O', data, err)

      if (err) return res.status(403).json({error: true, message: '403 Forbidden'})

      if (!isPayload(data)) return res.status(403).json({error: true, message: '403 Forbidden'})

      const user = await req._domain.FindByIDUserUseCase.execute({id: data.id})
      log('User -> %s', user.email)

      if (user.isEmpty()) return res.status(403).json({error: true, message: '403 Forbidden'})
      if (!user.verified) return res.status(401).json({error: true, message: '401 User not verified'})

      req.user = user
      next()
    })
  } catch (err) {
    debug('Auth FAILED')
    res.status(500).json({error: true, message: 'Internal Server Error'})
  }
}
