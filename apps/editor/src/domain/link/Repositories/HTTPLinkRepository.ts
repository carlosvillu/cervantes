import {z} from 'zod'

import {Config} from '../../_config'
import type {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {ID} from '../../_kernel/ID'
import {TimeStamp} from '../../_kernel/TimeStamp'
import {Body} from '../Models/Body'
import {Link} from '../Models/Link'
import {Links} from '../Models/Links'
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

  async findByID(id: ID): Promise<Link> {
    const [error, link] = await this.fetcher.get<FindByIDResponseType>(
      this.config.get('API_HOST') + '/link/' + id.value,
      {},
      FindByIDResponseSchema
    )

    if (error) return Link.empty()

    return Link.create({
      id: ID.create({value: link.id}),
      from: ID.create({value: link.from}),
      to: ID.create({value: link.to}),
      kind: link.kind,
      body: Body.create({value: link.body}),
      userID: ID.create({value: link.userID}),
      bookID: ID.create({value: link.bookID}),
      createdAt: TimeStamp.create({value: link.createdAt})
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
          createdAt: TimeStamp.create({value: link.createdAt})
        })
      )
    })
  }
}
