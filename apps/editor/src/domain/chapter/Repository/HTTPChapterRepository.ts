import {z} from 'zod'

import {Config} from '../../_config'
import type {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {ID} from '../../_kernel/ID'
import {TimeStamp} from '../../_kernel/TimeStamp'
import {Chapter} from '../Models/Chapter'
import {Chapters} from '../Models/Chapters'
import {Summary} from '../Models/Summary'
import {Title} from '../Models/Title'
import type {ChapterRepository} from './ChapterRepository'

const CreateResponseSchema = z.object({
  id: z.string({required_error: 'ID required'}),
  userID: z.string({required_error: 'userID required'}),
  bookID: z.string({required_error: 'bookID required'}),
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

export class HTTPChapterRepository implements ChapterRepository {
  static create(config: Config) {
    return new HTTPChapterRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async create(chapter: Chapter): Promise<Chapter> {
    const [error] = await this.fetcher.post<CreateResponseType>(
      this.config.get('API_HOST') + '/chapter',
      {body: chapter.toJSON()},
      CreateResponseSchema
    )

    if (error) return Chapter.empty()

    return chapter
  }

  async findByID(id: ID, bookID: ID): Promise<Chapter> {
    const [error, chapter] = await this.fetcher.get<FindByIDResponseType>(
      this.config.get('API_HOST') + '/chapter/' + id.value + `?bookID=${bookID.value as string}`,
      {},
      FindByIDResponseSchema
    )

    if (error) return Chapter.empty()

    return Chapter.create({
      id: ID.create({value: chapter.id}),
      userID: ID.create({value: chapter.userID}),
      bookID: ID.create({value: chapter.bookID}),
      summary: Summary.create({value: chapter.summary}),
      title: Title.create({value: chapter.title})
    })
  }

  async findAll(bookID: ID): Promise<Chapters> {
    const [error, chapters] = await this.fetcher.get<FindAllResponseType>(
      this.config.get('API_HOST') + '/chapter' + `?bookID=${bookID.value as string}`,
      {},
      // @ts-expect-error
      FindAllResponseSchema
    )

    if (error || !chapters) return Chapters.empty()

    return Chapters.create({
      chapters: chapters.map(chapter =>
        Chapter.create({
          id: ID.create({value: chapter.id}),
          userID: ID.create({value: chapter.userID}),
          bookID: ID.create({value: chapter.bookID}),
          summary: Summary.create({value: chapter.summary}),
          title: Title.create({value: chapter.title}),
          createdAt: TimeStamp.create({value: chapter.createdAt})
        })
      )
    })
  }
}
