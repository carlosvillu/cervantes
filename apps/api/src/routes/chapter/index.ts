import debug from 'debug'
import {Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validate.js'
import {createBodySchema, findByIDBodySchema, RequestCreate, RequestFindAll, RequestFindByID} from './schemas.js'

const log = debug('cervantes:api:routes:user')

export const router = Router()
router.post('/', auth(), validate(createBodySchema), async (req: RequestCreate, res: Response) => {
  log('Creating new chapter %j', req.body)

  const chapter = await req._domain.CreateChapterUseCase.execute({...req.body, userID: req.user.id!})

  if (chapter.isEmpty()) return res.status(410).json({error: true, message: 'Imposible create the chapter'})

  return res.status(201).json(chapter.toJSON())
})

router.get('/', auth(), async (req: RequestFindAll, res: Response) => {
  log(`Geting all chapters for user ${req.user.id!}`)

  const chapters = await req._domain.GetAllChapterUseCase.execute({bookID: req.query.bookID, userID: req.user.id!})

  return res.status(200).json(chapters.toJSON().chapters)
})

router.get('/:chapterID', validate(findByIDBodySchema), auth(), async (req: RequestFindByID, res: Response) => {
  log('Getting chapter => %o', req.params.chapterID)

  const chapter = await req._domain.FindByIDChapterUseCase.execute({
    id: req.params.chapterID,
    bookID: req.query.bookID,
    userID: req.user.id!
  })
  if (chapter.isEmpty()) return res.status(404).json({error: true, message: 'chapter NOT FOUND'})
  return res.status(200).json(chapter.toJSON())
})
