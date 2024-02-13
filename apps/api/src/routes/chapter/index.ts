import debug from 'debug'
import {Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validate.js'
import {
  createBodySchema,
  findByIDBodySchema,
  RequestCreate,
  RequestFindAll,
  RequestFindByID,
  RequestUpdate,
  updateBodySchema
} from './schemas.js'

const log = debug('cervantes:api:routes:chapter')

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

router.put('/:chapterID', auth(), validate(updateBodySchema), async (req: RequestUpdate, res: Response) => {
  log('Updating the chapter %j', req.body)

  if (req.body.id !== req.params.chapterID)
    return res.status(410).json({error: true, message: 'Imposible update the chapter'})

  const chapter = await req._domain.UpdateChapterUseCase.execute({
    ...req.body,
    createdAt: String(req.body.createdAt),
    userID: req.user.id!
  })

  if (chapter.isEmpty()) return res.status(410).json({error: true, message: 'Imposible update the chapter'})

  return res.status(200).json(chapter.toJSON())
})

router.delete('/:chapterID', validate(findByIDBodySchema), auth(), async (req: RequestFindByID, res: Response) => {
  log('Removing chapter => %o', req.params.chapterID)

  const link = await req._domain.RemoveByIDChapterUseCase.execute({
    id: req.params.chapterID,
    userID: req.user.id!
  })
  if (!link.isEmpty()) return res.status(404).json({error: true, message: 'chapter NOT FOUND'})
  return res.status(200).json(link.toJSON())
})
