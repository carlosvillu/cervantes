import debug from 'debug'
import {Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validate.js'
import {createBodySchema, findByIDBodySchema, RequestCreate, RequestFindAll, RequestFindByID} from './schemas.js'

const log = debug('cervantes:api:routes:user')

export const router = Router()
router.post('/', auth(), validate(createBodySchema), async (req: RequestCreate, res: Response) => {
  log('Creating new link %j', req.body)

  const link = await req._domain.CreateLinkUseCase.execute({...req.body, userID: req.user.id!})

  if (link.isEmpty()) return res.status(410).json({error: true, message: 'Imposible create the link'})

  return res.status(201).json(link.toJSON())
})

router.get('/', auth(), async (req: RequestFindAll, res: Response) => {
  log(`Geting all links for user ${req.user.id!}`)

  const links = await req._domain.GetAllLinkUseCase.execute({from: req.query.from, userID: req.user.id!})

  return res.status(200).json(links.toJSON().links)
})

router.get('/:linkID', validate(findByIDBodySchema), auth(), async (req: RequestFindByID, res: Response) => {
  log('Getting link => %o', req.params.linkID)

  const link = await req._domain.FindByIDLinkUseCase.execute({
    id: req.params.linkID,
    userID: req.user.id!
  })
  if (link.isEmpty()) return res.status(404).json({error: true, message: 'link NOT FOUND'})
  return res.status(200).json(link.toJSON())
})
