import {z} from 'zod'

import {Config} from '../../_config'
import type {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {ID} from '../../_kernel/ID'
import {TimeStamp} from '../../_kernel/TimeStamp'
import {Body} from '../Models/Body'
import {Chapter} from '../Models/Chapter'
import {Link} from '../Models/Link'
import {Links} from '../Models/Links'
import {Title} from '../Models/Title'
import type {LinkRepository} from './LinkRepository'

const CreateResponseSchema = z.object({
  id: z.string({required_error: 'ID required'}),
  from: z.string({required_error: 'from required'}),
  to: z.string({required_error: 'to required'}),
  body: z.string({required_error: 'body required'}),
  kind: z.string({required_error: 'kind required'}),
  userID: z.string({required_error: 'userID required'}),
  bookID: z.string({required_error: 'bookID required'})
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

const FindChapterByIDResponseSchema = z.object({
  id: z.string({required_error: 'ID required'}),
  title: z.string({required_error: 'title required'})
})
type FindChapterByIDResponseType = z.infer<typeof FindChapterByIDResponseSchema>

const RemoveByIDResponseSchema = z.object({})
type RemoveByIDResponseType = z.infer<typeof RemoveByIDResponseSchema>

export class HTTPLinkRepository implements LinkRepository {
  static create(config: Config) {
    return new HTTPLinkRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async create(link: Link): Promise<Link> {
    const [error] = await this.fetcher.post<CreateResponseType>(
      this.config.get('API_HOST') + '/link',
      {body: link.toJSON()},
      CreateResponseSchema
    )

    if (error) return Link.empty()

    return link
  }

  async findChapterByID(chapterID: ID, bookID: ID): Promise<Chapter> {
    const [error, chapter] = await this.fetcher.get<FindChapterByIDResponseType>(
      this.config.get('API_HOST') + '/chapter/' + chapterID.value + `?bookID=${bookID.value as string}`,
      {},
      FindChapterByIDResponseSchema
    )

    if (error) return Chapter.empty()

    return Chapter.create({
      id: ID.create({value: chapter.id}),
      title: Title.create({value: chapter.title})
    })
  }

  async findByID(id: ID): Promise<Link> {
    const [error, link] = await this.fetcher.get<FindByIDResponseType>(
      this.config.get('API_HOST') + '/link/' + id.value,
      {},
      FindByIDResponseSchema
    )

    if (error) return Link.empty()

    const [toChapter, fromChapter] = await Promise.all([
      this.findChapterByID(ID.create({value: link.to}), ID.create({value: link.bookID})),
      this.findChapterByID(ID.create({value: link.from}), ID.create({value: link.bookID}))
    ])

    return Link.create({
      id: ID.create({value: link.id}),
      from: ID.create({value: link.from}),
      to: ID.create({value: link.to}),
      kind: link.kind,
      body: Body.create({value: link.body}),
      userID: ID.create({value: link.userID}),
      bookID: ID.create({value: link.bookID}),
      createdAt: TimeStamp.create({value: link.createdAt}),
      toChapter,
      fromChapter
    })
  }

  async findAll(from: ID): Promise<Links> {
    const [error, links] = await this.fetcher.get<FindAllResponseType>(
      this.config.get('API_HOST') + '/link' + `?from=${from.value as string}`,
      {},
      // @ts-expect-error
      FindAllResponseSchema
    )

    if (error || !links) return Links.empty()

    const chaptersMap = links.reduce((acc: {[idx: string]: Promise<Chapter>}, link) => {
      if (!acc[link.from]) acc[link.from] = this.findChapterByID(ID.create({value: link.from}), ID.create({value: link.bookID})) // eslint-disable-line 
      if (!acc[link.to]) acc[link.to] = this.findChapterByID(ID.create({value: link.to}), ID.create({value: link.bookID})) // eslint-disable-line 

      return acc
    }, {})

    const chaptersList = (await Promise.all(Object.values(chaptersMap))) as Chapter[]
    const chaptersDB = chaptersList.reduce((acc: {[idx: string]: Chapter}, chapter) => {
      acc[chapter.id!] = acc[chapter.id!] ?? chapter
      return acc
    }, {})

    return Links.create({
      links: links.map(link =>
        Link.create({
          id: ID.create({value: link.id}),
          from: ID.create({value: link.from}),
          to: ID.create({value: link.to}),
          kind: link.kind,
          body: Body.create({value: link.body}),
          userID: ID.create({value: link.userID}),
          bookID: ID.create({value: link.bookID}),
          createdAt: TimeStamp.create({value: link.createdAt}),
          toChapter: chaptersDB[link.to],
          fromChapter: chaptersDB[link.from]
        })
      )
    })
  }

  async removeByID(id: ID): Promise<Link> {
    const [error] = await this.fetcher.del<RemoveByIDResponseType>(
      this.config.get('API_HOST') + '/link/' + id.value,
      {},
      RemoveByIDResponseSchema
    )

    if (error) return Link.empty()

    return Link.empty()
  }
}
