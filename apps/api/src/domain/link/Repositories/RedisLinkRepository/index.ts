/* eslint @typescript-eslint/no-non-null-assertion:0 */

import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import {Config} from '../../../_config/index.js'
import {ID} from '../../../_kernel/ID.js'
import {TimeStamp} from '../../../_kernel/TimeStamp.js'
import {Redis} from '../../../_redis/index.js'
import {Body} from '../../Models/Body.js'
import {Link} from '../../Models/Link.js'
import {Links} from '../../Models/Links.js'
import {LinkRepository} from '../LinkRepository.js'
import {LinkRecord, linkSchema} from './schemas.js'

export class RedisLinkRepository implements LinkRepository {
  #indexCreated = false
  #chapterRepository: Repository | undefined = undefined

  static create(config: Config) {
    return new RedisLinkRepository(config)
  }

  constructor(private readonly config: Config) {}

  async create(link: Link): Promise<Link> {
    if (link.isEmpty()) return link

    await this.#createIndex()

    const linkRecord = (await this.#chapterRepository?.save(link.id!, link.attributes())) as LinkRecord

    if (linkRecord === null || linkRecord === undefined) return Link.empty()
    return link
  }

  async findByID(id: ID, userID: ID): Promise<Link> {
    await this.#createIndex()

    const linkRecord = (await this.#chapterRepository?.fetch(id.value)) as LinkRecord

    if (linkRecord === null || linkRecord === undefined) return Link.empty()
    if (linkRecord.userID !== userID.value) return Link.empty()

    return Link.create({
      id: ID.create({value: linkRecord[EntityId] as string}),
      body: Body.create({value: linkRecord.body}),
      from: ID.create({value: linkRecord.from}),
      to: ID.create({value: linkRecord.to}),
      kind: linkRecord.kind,
      userID: ID.create({value: linkRecord.userID}),
      bookID: ID.create({value: linkRecord.bookID}),
      createdAt: TimeStamp.create({value: linkRecord.createdAt})
    })
  }

  async findAll(from: ID, userID: ID): Promise<Links> {
    await this.#createIndex()

    const linksRecords = (await this.#chapterRepository
      ?.searchRaw(`@userID:{${userID.value} @from:{${from.value}}`)
      .return.all()) as LinkRecord[]

    if (linksRecords === null || linksRecords === undefined) return Links.empty()

    return Links.create({
      links: linksRecords.map(linkRecord =>
        Link.create({
          id: ID.create({value: linkRecord[EntityId] as string}),
          body: Body.create({value: linkRecord.body}),
          from: ID.create({value: linkRecord.from}),
          to: ID.create({value: linkRecord.to}),
          kind: linkRecord.kind,
          userID: ID.create({value: linkRecord.userID}),
          bookID: ID.create({value: linkRecord.bookID}),
          createdAt: TimeStamp.create({value: linkRecord.createdAt})
        })
      )
    })
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#chapterRepository = new Repository(linkSchema, client)
    this.#indexCreated = true
    return this.#chapterRepository.createIndex()
  }
}
