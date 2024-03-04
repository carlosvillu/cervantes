import {Config} from '../../../_config'
import {Fetcher} from '../../../_fetcher/Fetcher'
import {WindowFetcher} from '../../../_fetcher/WindowFetcher'
import {ID} from '../../../_kernel/ID'
import {TimeStamp} from '../../../_kernel/TimeStamp'
import {BookCover} from '../../Models/BookCover'
import {Key} from '../../Models/Key'
import {ImageRepository} from '../ImageRepository'
import {
  CreateBookCoverResponseSchema,
  CreateBookCoverResponseType,
  FindBookCoverByBookIDResponseSchema,
  FindBookCoverByBookIDResponseType,
  RemoveBookCoverByBookIDResponseSchema,
  RemoveBookCoverByBookIDResponseType
} from './schemas'

export class HTTPImageRepository implements ImageRepository {
  static create(config: Config) {
    return new HTTPImageRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async createBookCover(cover: BookCover): Promise<BookCover> {
    const [error, resp] = await this.fetcher.post<CreateBookCoverResponseType>(
      this.config.get('API_HOST') + '/image/bookcover',
      {body: cover.toJSON()},
      CreateBookCoverResponseSchema
    )

    if (error) return BookCover.empty()

    return BookCover.create({
      id: ID.create({value: resp.id}),
      key: Key.create({value: resp.key}),
      bookID: ID.create({value: resp.bookID}),
      createdAt: TimeStamp.create({value: +resp.createdAt}),
      updatedAt: TimeStamp.create({value: +resp.updatedAt})
    })
  }

  async findBookCoverByBookID(bookID: ID): Promise<BookCover> {
    const [error, resp] = await this.fetcher.get<FindBookCoverByBookIDResponseType>(
      this.config.get('API_HOST') + '/image/bookcover?bookID=' + bookID.value + '&_c=' + Math.random(),
      {},
      FindBookCoverByBookIDResponseSchema
    )

    if (error) return BookCover.empty()

    return BookCover.create({
      id: ID.create({value: resp.id}),
      key: Key.create({value: resp.key}),
      bookID: ID.create({value: resp.bookID}),
      createdAt: TimeStamp.create({value: +resp.createdAt}),
      updatedAt: TimeStamp.create({value: +resp.updatedAt})
    })
  }

  async deleteBookCoverByBookID(bookID: ID): Promise<BookCover> {
    const [error] = await this.fetcher.del<RemoveBookCoverByBookIDResponseType>(
      this.config.get('API_HOST') + '/image/bookcover?bookID=' + bookID.value,
      {},
      RemoveBookCoverByBookIDResponseSchema
    )

    if (error) return BookCover.empty()

    return BookCover.empty()
  }
}
