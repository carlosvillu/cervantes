import debug from 'debug'
import {Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validate.js'
import {
  getBookCoverImageByBookIDBodySchema,
  getChapterCoverImageByChapterIDBodySchema,
  removeBookCoverImageByBookIDBodySchema,
  removeChapterCoverImageByChapterIDBodySchema,
  RequestGetBookCoverImageByBookID,
  RequestGetChapterCoverImageByChapterID,
  RequestRemoveBookCoverImageByBookID,
  RequestRemoveChapterCoverImageByChapterID,
  RequestSetBookCoverImage,
  RequestSetChapterCoverImage,
  setBookCoverImageBodySchema,
  setChapterCoverImageBodySchema
} from './schemas.js'

const log = debug('cervantes:api:routes:image')

export const router = Router()
router.get(
  '/bookcover',
  auth(),
  validate(getBookCoverImageByBookIDBodySchema),
  async (req: RequestGetBookCoverImageByBookID, res: Response) => {
    log('Getting book cover image by bookID and userID')

    const bookcover = await req._domain.FindBookCoverByBookIDImageUseCase.execute({
      bookID: req.query.bookID,
      userID: req.user.id!
    })

    if (bookcover.isEmpty()) return res.status(410).json({error: true, message: 'Imposible find the Image'})

    return res.status(200).json(bookcover.toJSON())
  }
)

router.get(
  '/chaptercover',
  auth(),
  validate(getChapterCoverImageByChapterIDBodySchema),
  async (req: RequestGetChapterCoverImageByChapterID, res: Response) => {
    log('Getting chapter cover image by bookID, chapterID and userID')

    const chaptercover = await req._domain.FindChapterCoverByChapterIDImageUseCase.execute({
      bookID: req.query.bookID,
      chapterID: req.query.chapterID,
      userID: req.user.id!
    })

    if (chaptercover.isEmpty()) return res.status(410).json({error: true, message: 'Imposible find the Image'})

    return res.status(200).json(chaptercover.toJSON())
  }
)

router.delete(
  '/bookcover',
  auth(),
  validate(removeBookCoverImageByBookIDBodySchema),
  async (req: RequestRemoveBookCoverImageByBookID, res: Response) => {
    log('Removing book cover image by bookID and userID')

    const bookcover = await req._domain.DeleteBookCoverByBookIDImageUseCase.execute({
      bookID: req.query.bookID,
      userID: req.user.id!
    })

    return res.status(200).json(bookcover.toJSON())
  }
)

router.delete(
  '/chaptercover',
  auth(),
  validate(removeChapterCoverImageByChapterIDBodySchema),
  async (req: RequestRemoveChapterCoverImageByChapterID, res: Response) => {
    log('Removing chapter cover image by bookID, chapterID and userID')

    const chaptercover = await req._domain.DeleteChapterCoverByChapterIDImageUseCase.execute({
      bookID: req.query.bookID,
      chapterID: req.query.chapterID,
      userID: req.user.id!
    })

    return res.status(200).json(chaptercover.toJSON())
  }
)

router.post(
  '/bookcover',
  auth(),
  validate(setBookCoverImageBodySchema),
  async (req: RequestSetBookCoverImage, res: Response) => {
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

router.post(
  '/chaptercover',
  auth(),
  validate(setChapterCoverImageBodySchema),
  async (req: RequestSetChapterCoverImage, res: Response) => {
    log(`Setting chapter cover image by chapterID, bookID and userID with KEY -> ${req.body.key}`)

    const chaptercover = await req._domain.CreateChapterCoverImageUseCase.execute({
      id: req.body.id,
      bookID: req.body.bookID,
      chapterID: req.body.chapterID,
      userID: req.user.id!,
      key: req.body.key
    })

    if (chaptercover.isEmpty()) return res.status(410).json({error: true, message: 'Imposible create the Image'})

    return res.status(201).json(chaptercover.toJSON())
  }
)
