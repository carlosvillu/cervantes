import {Config} from '../../../_config'
import {Fetcher} from '../../../_fetcher/Fetcher'
import {WindowFetcher} from '../../../_fetcher/WindowFetcher'
import {ID} from '../../../_kernel/ID'
import {TimeStamp} from '../../../_kernel/TimeStamp'
import {BookCover} from '../../Models/BookCover'
import {ChapterCover} from '../../Models/ChapterCover'
import {Key} from '../../Models/Key'
import {ImageRepository} from '../ImageRepository'
import {
  CreateBookCoverResponseSchema,
  CreateBookCoverResponseType,
  CreateChapterCoverResponseSchema,
  CreateChapterCoverResponseType,
  FindBookCoverByBookIDResponseSchema,
  FindBookCoverByBookIDResponseType,
  FindChapterCoverByChapterIDResponseSchema,
  FindChapterCoverByChapterIDResponseType,
  RemoveBookCoverByBookIDResponseSchema,
  RemoveBookCoverByBookIDResponseType,
  RemoveChapterCoverByChapterIDResponseSchema,
  RemoveChapterCoverByChapterIDResponseType
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

  async createChapterCover(cover: ChapterCover): Promise<ChapterCover> {
    const [error, resp] = await this.fetcher.post<CreateChapterCoverResponseType>(
      this.config.get('API_HOST') + '/image/chaptercover',
      {body: cover.toJSON()},
      CreateChapterCoverResponseSchema
    )

    if (error) return ChapterCover.empty()

    return ChapterCover.create({
      id: ID.create({value: resp.id}),
      key: Key.create({value: resp.key}),
      bookID: ID.create({value: resp.bookID}),
      chapterID: ID.create({value: resp.chapterID}),
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

  async findChapterCoverByChapterID(chapterID: ID, bookID: ID): Promise<ChapterCover> {
    const [error, resp] = await this.fetcher.get<FindChapterCoverByChapterIDResponseType>(
      this.config.get('API_HOST') + '/image/chaptercover?bookID=' + bookID.value + '&chapterID=' + chapterID.value + '&_c=' + Math.random(), // eslint-disable-line
      {},
      FindChapterCoverByChapterIDResponseSchema
    )

    if (error) return ChapterCover.empty()

    return ChapterCover.create({
      id: ID.create({value: resp.id}),
      key: Key.create({value: resp.key}),
      bookID: ID.create({value: resp.bookID}),
      chapterID: ID.create({value: resp.chapterID}),
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

  async deleteChapterCoverByChapterID(chapterID: ID, bookID: ID): Promise<ChapterCover> {
    const [error] = await this.fetcher.del<RemoveChapterCoverByChapterIDResponseType>(
      this.config.get('API_HOST') + '/image/chaptercover?bookID=' + bookID.value + '&chapterID=' + chapterID.value,
      {},
      RemoveChapterCoverByChapterIDResponseSchema
    )

    if (error) return ChapterCover.empty()

    return ChapterCover.empty()
  }
}
