import {Config} from '../../../_config'
import type {Fetcher} from '../../../_fetcher/Fetcher'
import {WindowFetcher} from '../../../_fetcher/WindowFetcher'
import {ID} from '../../../_kernel/ID'
import {TimeStamp} from '../../../_kernel/TimeStamp'
import {Book} from '../../Models/Book'
import {Books} from '../../Models/Books'
import {PublishStatus} from '../../Models/PublishStatus'
import {Summary} from '../../Models/Summary'
import {Title} from '../../Models/Title'
import type {BookRepository} from '../BookRepository'
import * as schemas from './schemas'

export class HTTPBookRepository implements BookRepository {
  static create(config: Config) {
    return new HTTPBookRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async create(book: Book): Promise<Book> {
    const [error] = await this.fetcher.post<schemas.CreateResponseType>(
      this.config.get('API_HOST') + '/book',
      {body: book.toJSON()},
      schemas.CreateResponseSchema
    )

    if (error) return Book.empty()

    return book
  }

  async update(book: Book): Promise<Book> {
    const [error] = await this.fetcher.put<schemas.UpdateResponseType>(
      this.config.get('API_HOST') + `/book/${book.id as string}`,
      {body: book.toJSON()},
      schemas.UpdateResponseSchema
    )

    if (error) return Book.empty()

    return book
  }

  async findByID(id: ID): Promise<Book> {
    const [error, book] = await this.fetcher.get<schemas.FindByIDResponseType>(
      this.config.get('API_HOST') + '/book/' + id.value,
      {},
      schemas.FindByIDResponseSchema
    )

    if (error) return Book.empty()

    return Book.create({
      id: ID.create({value: book.id}),
      userID: ID.create({value: book.userID}),
      summary: Summary.create({value: book.summary}),
      published: PublishStatus.create({value: book.published ?? false}),
      title: Title.create({value: book.title}),
      createdAt: TimeStamp.create({value: book.createdAt}),
      updatedAt: TimeStamp.create({value: book.updatedAt})
    })
  }

  async findAll(): Promise<Books> {
    const [error, books] = await this.fetcher.get<schemas.FindAllResponseType>(
      this.config.get('API_HOST') + '/book',
      {},
      // @ts-expect-error
      schemas.FindAllResponseSchema
    )

    if (error || !books) return Books.empty()

    return Books.create({
      books: books.map(book =>
        Book.create({
          id: ID.create({value: book.id}),
          userID: ID.create({value: book.userID}),
          summary: Summary.create({value: book.summary}),
          published: PublishStatus.create({value: book.published ?? false}),
          title: Title.create({value: book.title}),
          createdAt: TimeStamp.create({value: book.createdAt}),
          updatedAt: TimeStamp.create({value: book.updatedAt})
        })
      )
    })
  }
}
