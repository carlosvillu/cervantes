import {z} from 'zod'

import {Config} from '../../_config'
import type {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {ID} from '../../_kernel/ID'
import {TimeStamp} from '../../_kernel/TimeStamp'
import {Book} from '../Models/Book'
import {Books} from '../Models/Books'
import {Summary} from '../Models/Summary'
import {Title} from '../Models/Title'
import type {BookRepository} from './BookRepository'

const CreateResponseSchema = z.object({
  id: z.string({required_error: 'ID required'}),
  userID: z.string({required_error: 'userID required'}),
  summary: z.string({required_error: 'Summary required'}),
  title: z.string({required_error: 'Title required'})
})
type CreateResponseType = z.infer<typeof CreateResponseSchema>

const FindAllResponseSchema = CreateResponseSchema.extend({
  createdAt: z.number({required_error: 'CreatedAt required'})
}).array()
type FindAllResponseType = z.infer<typeof FindAllResponseSchema>

const FindByIDResponseSchema = CreateResponseSchema.extend({
  createdAt: z.number({required_error: 'CreatedAt required'})
})
type FindByIDResponseType = z.infer<typeof FindByIDResponseSchema>

export class HTTPBookRepository implements BookRepository {
  static create(config: Config) {
    return new HTTPBookRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async create(book: Book): Promise<Book> {
    const [error] = await this.fetcher.post<CreateResponseType>(
      this.config.get('API_HOST') + '/book',
      {body: book.toJSON()},
      CreateResponseSchema
    )

    if (error) return Book.empty()

    return book
  }

  async findByID(id: ID): Promise<Book> {
    const [error, book] = await this.fetcher.get<FindByIDResponseType>(
      this.config.get('API_HOST') + '/book/' + id.value,
      {},
      FindByIDResponseSchema
    )

    if (error) return Book.empty()

    return Book.create({
      id: ID.create({value: book.id}),
      userID: ID.create({value: book.userID}),
      summary: Summary.create({value: book.summary}),
      title: Title.create({value: book.title})
    })
  }

  async findAll(): Promise<Books> {
    const [error, books] = await this.fetcher.get<FindAllResponseType>(
      this.config.get('API_HOST') + '/book',
      {},
      // @ts-expect-error
      FindAllResponseSchema
    )

    if (error || !books) return Books.empty()

    return Books.create({
      books: books.map(book =>
        Book.create({
          id: ID.create({value: book.id}),
          userID: ID.create({value: book.userID}),
          summary: Summary.create({value: book.summary}),
          title: Title.create({value: book.title}),
          createdAt: TimeStamp.create({value: book.createdAt})
        })
      )
    })
  }
}
