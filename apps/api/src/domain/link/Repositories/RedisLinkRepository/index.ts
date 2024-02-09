import {type Repository, EntityId} from 'redis-om'

import {DomainError} from '../../../_kernel/DomainError.js'
import {ErrorCodes} from '../../../_kernel/ErrorsCode.js'
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
  #linkRepository: Repository | undefined = undefined

  static create() {
    return new RedisLinkRepository()
  }

  async create(link: Link): Promise<Link | DomainError> {
    if (link.isEmpty()) return link

    await this.#createIndex()

    const linksRecords = (await this.#linkRepository
      ?.searchRaw(`@userID:{${link.userID!}} @from:{${link.from!}}`)
      .return.all()) as LinkRecord[]

    if (link.isDirect() && linksRecords.length !== 0)
      return DomainError.create(
        [new Error(ErrorCodes.LINK_CREATE_NO_MORE_THAN_ONE_DIRECT_LINK)],
        '[RedisLinkRepository#create] Imposible create link'
      )

    if (linksRecords.some(link => link.kind === 'direct'))
      return DomainError.create(
        [new Error(ErrorCodes.LINK_CREATE_NO_MORE_THAN_ONE_DIRECT_LINK)],
        '[RedisLinkRepository#create] Imposible create link'
      )

    const linkRecord = (await this.#linkRepository?.save(link.id!, link.attributes())) as LinkRecord

    if (linkRecord === null || linkRecord === undefined) return Link.empty()
    return link
  }

  async findByID(id: ID, userID: ID): Promise<Link> {
    await this.#createIndex()

    const linkRecord = (await this.#linkRepository?.fetch(id.value)) as LinkRecord

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

    const linksRecords = (await this.#linkRepository
      ?.searchRaw(`@userID:{${userID.value}} @from:{${from.value}}`)
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

  async removeByID(id: ID, userID: ID): Promise<Link> {
    await this.#createIndex()

    const linkRecord = (await this.#linkRepository?.fetch(id.value)) as LinkRecord
    if (linkRecord === null || linkRecord === undefined) return Link.empty()
    if (linkRecord.userID !== userID.value) return Link.empty()

    await this.#linkRepository?.remove(id.value)

    return Link.empty()
  }

  async removeByChapterID(id: ID, userID: ID): Promise<Links> {
    await this.#createIndex()

    const linksFromRecords = (await this.#linkRepository
      ?.searchRaw(`@userID:{${userID.value}} @from:{${id.value}}`)
      .return.all()) as LinkRecord[]

    const linksToRecords = (await this.#linkRepository
      ?.searchRaw(`@userID:{${userID.value}} @to:{${id.value}}`)
      .return.all()) as LinkRecord[]

    if (!linksFromRecords && !linksToRecords) return Links.empty()

    await Promise.all(
      [...linksToRecords, ...linksFromRecords].map(async linkRecord =>
        this.#linkRepository?.remove(linkRecord[EntityId] as string)
      )
    )

    return Links.empty()
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const redis = Redis.create()
    await redis.createAndConnectClient()

    this.#linkRepository = redis.repository(linkSchema)
    this.#indexCreated = true
    return this.#linkRepository?.createIndex()
  }
}
