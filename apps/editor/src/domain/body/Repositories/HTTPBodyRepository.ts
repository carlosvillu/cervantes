import {z} from 'zod'

import {Config} from '../../_config'
import type {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {ID} from '../../_kernel/ID'
import {TimeStamp} from '../../_kernel/TimeStamp'
import {Bodies} from '../Models/Bodies'
import {Body} from '../Models/Body'
import type {BodyRepository} from './BodyRepository'

const CreateResponseSchema = z.object({
  id: z.string({required_error: 'ID required'}),
  userID: z.string({required_error: 'userID required'}),
  bookID: z.string({required_error: 'bookID required'}),
  chapterID: z.string({required_error: 'chapterID required'}),
  content: z.string({required_error: 'content required'})
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

export class HTTPBodyRepository implements BodyRepository {
  static create(config: Config) {
    return new HTTPBodyRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async save(body: Body): Promise<Body> {
    const [error] = await this.fetcher.post<CreateResponseType>(
      this.config.get('API_HOST') + '/body',
      {body: body.toJSON()},
      CreateResponseSchema
    )

    if (error) return Body.empty()

    return body
  }

  async findByID(id: ID): Promise<Body> {
    const [error, body] = await this.fetcher.get<FindByIDResponseType>(
      this.config.get('API_HOST') + '/body/' + id.value,
      {},
      FindByIDResponseSchema
    )

    if (error) return Body.empty()

    return Body.create({
      id: ID.create({value: body.id}),
      userID: ID.create({value: body.userID}),
      bookID: ID.create({value: body.bookID}),
      chapterID: ID.create({value: body.chapterID}),
      content: body.content,
      createdAt: TimeStamp.create({value: body.createdAt})
    })
  }

  async findOneBy(_: ID, bookID: ID, chapterID: ID): Promise<Body> {
    const bodies = await this.findAll(bookID, chapterID)

    if (bodies.isEmpty()) return Body.empty()
    return bodies.latest()
  }

  async findAll(bookID: ID, chapterID: ID): Promise<Bodies> {
    const [error, bodies] = await this.fetcher.get<FindAllResponseType>(
      this.config.get('API_HOST') +
        '/body' +
        `?bookID=${bookID.value as string}&chapterID=${chapterID.value as string}`,
      {},
      // @ts-expect-error
      FindAllResponseSchema
    )

    if (error || !bodies) return Bodies.empty()

    return Bodies.create({
      bodies: bodies.map(body =>
        Body.create({
          id: ID.create({value: body.id}),
          userID: ID.create({value: body.userID}),
          bookID: ID.create({value: body.bookID}),
          chapterID: ID.create({value: body.chapterID}),
          content: body.content,
          createdAt: TimeStamp.create({value: body.createdAt})
        })
      )
    })
  }
}
