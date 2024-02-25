import debug from 'debug'
import {Request, Response, Router} from 'express'
import {UploadedFile} from 'express-fileupload'

import {auth} from '../../middlewares/auth.js'

const log = debug('cervantes:api:routes:upload')

export const router = Router()
router.post('/image', auth(), async (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }
  log('Uploading to CDN a file')

  const image = req.files?.image as UploadedFile

  const result = await req._domain.UploadImageStaticsUseCase.execute({file: image})
  debugger

  if (!result.isSuccess()) return res.status(500).json({error: true, cause: result.cause?.message})

  return res.status(201).json(result.toJSON())
})
