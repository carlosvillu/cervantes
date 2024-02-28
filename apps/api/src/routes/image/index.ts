import debug from 'debug'
import {Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validate.js'
import {
  getCoverImageByBookIDBodySchema,
  RequestGetCoverImageByBookID,
  RequestSetCoverImage,
  setCoverImageBodySchema
} from './schemas.js'

const log = debug('cervantes:api:routes:image')

export const router = Router()
router.get(
  '/bookcover',
  auth(),
  validate(getCoverImageByBookIDBodySchema),
  async (req: RequestGetCoverImageByBookID, res: Response) => {
    log('Getting cover image by bookID and userID')

    const bookcover = await req._domain.FindBookCoverByBookIDImageUseCase.execute({
      bookID: req.query.bookID,
      userID: req.user.id!
    })

    if (bookcover.isEmpty()) return res.status(410).json({error: true, message: 'Imposible find the Image'})

    return res.status(200).json(bookcover.toJSON())
  }
)

router.post(
  '/bookcover',
  auth(),
  validate(setCoverImageBodySchema),
  async (req: RequestSetCoverImage, res: Response) => {
    log(`Setting cover image by bookID and userID with KEY -> ${req.body.key}`)

    const bookcover = await req._domain.CreateBookCoverImageUseCase.execute({
      id: req.body.id,
      bookID: req.body.bookID,
      userID: req.user.id!,
      key: req.body.key
    })

    if (bookcover.isEmpty()) return res.status(410).json({error: true, message: 'Imposible create the Image'})

    return res.status(201).json(bookcover.toJSON())
  }
)
