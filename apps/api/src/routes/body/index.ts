import debug from 'debug'
import {Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validate.js'
import {createBodySchema, findByIDBodySchema, RequestCreate, RequestFindAll, RequestFindByID} from './schemas.js'

const log = debug('cervantes:api:routes:body')

export const router = Router()
router.post('/', auth(), validate(createBodySchema), async (req: RequestCreate, res: Response) => {
  log('Creating new body %j', req.body)

  const body = await req._domain.AddBodyUseCase.execute({...req.body, userID: req.user.id!})

  if (body.isEmpty()) return res.status(410).json({error: true, message: 'Imposible create the body'})

  return res.status(201).json(body.toJSON())
})

router.get('/', auth(), async (req: RequestFindAll, res: Response) => {
  log(`Geting all bodies for user %s, bookID %s and chapterID %s`, req.user.id!, req.query.bookID, req.query.chapterID)

  const bodies = await req._domain.GetAllBodyUseCase.execute({
    userID: req.user.id!,
    bookID: req.query.bookID,
    chapterID: req.query.chapterID
  })

  return res.status(200).json(bodies.toJSON().bodies)
})

router.get('/:bodyID', validate(findByIDBodySchema), auth(), async (req: RequestFindByID, res: Response) => {
  log('Getting body => %o', req.params.bodyID)

  const body = await req._domain.FindByIDBodyUseCase.execute({
    id: req.params.bodyID,
    userID: req.user.id!
  })
  if (body.isEmpty()) return res.status(404).json({error: true, message: 'body NOT FOUND'})
  return res.status(200).json(body.toJSON())
})
