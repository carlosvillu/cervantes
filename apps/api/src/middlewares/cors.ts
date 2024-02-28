/* eslint @typescript-eslint/no-misused-promises: 0 */

import {NextFunction, Request, Response} from 'express'

export const cors = () => (req: Request, res: Response, next: NextFunction) => {
  const ALLOW_ORIGINS = ['localhost', 'cervantes-editor.fly.dev', 'editor.bookadventur.es']
  if (ALLOW_ORIGINS.some(origin => req.header('origin')?.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', req.get('origin')!)
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  }
  next()
}
