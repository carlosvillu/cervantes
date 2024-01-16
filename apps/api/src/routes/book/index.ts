import debug from 'debug'
import {Request, Response, Router} from 'express'

import {auth} from '../../middlewares/auth.js'
import {validate} from '../../middlewares/validate.js'
import {createBodySchema, findByIDBodySchema, RequestCreate, RequestFindByID} from './schemas.js'

const log = debug('cervantes:api:routes:book')

export const router = Router()
router.post('/', auth(), validate(createBodySchema), async (req: RequestCreate, res: Response) => {
  log('Creating new Book %j', req.body)

  const book = await req._domain.CreateBookUseCase.execute({...req.body, userID: req.user.id!})

  if (book.isEmpty()) return res.status(410).json({error: true, message: 'Imposible create the book'})

  return res.status(201).json(book.toJSON())
})

router.get('/', auth(), async (req: Request, res: Response) => {
  log(`Geting all books for user ${req.user.id!}`)

  const books = await req._domain.GetAllBookUseCase.execute({userID: req.user.id!})

  return res.status(200).json(books.toJSON().books)
})

router.get('/:bookID', validate(findByIDBodySchema), auth(), async (req: RequestFindByID, res: Response) => {
  log('Getting book => %o', req.params.bookID)

  const book = await req._domain.FindByIDBookUseCase.execute({id: req.params.bookID, userID: req.user.id!})

  if (book.isEmpty()) return res.status(404).json({error: true, message: 'Book NOT FOUND'})

  return res.status(200).json(book.toJSON())
})
