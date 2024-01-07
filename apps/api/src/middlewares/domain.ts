/* eslint @typescript-eslint/no-misused-promises: 0 */

import {NextFunction, Request, Response} from 'express'

import {Domain} from '../domain/index.js'

export async function domain(req: Request, _: Response, next: NextFunction) {
  const domain = new Domain({})

  req._domain = domain
  next()
}
