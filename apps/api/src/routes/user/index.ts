import debug from 'debug'
import {Request, Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'

const log = debug('cervantes:api:routes:user')

export const router = Router()
router.get('/current', auth(), async (req: Request, res: Response) => {
  log('Getting current user')
  return res.status(200).json(req.user.toJSON())
})
