import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import {ID} from '../../../_kernel/ID.js'
import {TimeStamp} from '../../../_kernel/TimeStamp.js'
import {Redis} from '../../../_redis/index.js'
import {Bodies} from '../../Models/Bodies.js'
import {Body} from '../../Models/Body.js'
import {Hash} from '../../Models/Hash.js'
import {BodyRepository} from '../BodyRepository.js'
import {BodyRecord, bodySchema} from './schemas.js'

export class RedisBodyRepository implements BodyRepository {
  #indexCreated = false
  #bodyRepository: Repository | undefined = undefined

  static create() {
    return new RedisBodyRepository()
  }

  async create(body: Body): Promise<Body> {
    if (body.isEmpty()) return body
    const savedBody = await this.findByHash(Hash.create({value: body.content!}))
    if (!savedBody.isEmpty()) return savedBody

    await this.#createIndex()

    const bodyRecord = await this.#bodyRepository?.save(body.id!, body.attributes())

    if (bodyRecord === null || bodyRecord === undefined) return Body.empty()
    return body
  }

  async findByHash(hash: Hash, userID?: ID): Promise<Body> {
    await this.#createIndex()
    let query = `@hash:{${hash.value}}`
    if (userID !== undefined) query += ` @userID:{${userID.value}}`

    const [bodyRecord] = ((await this.#bodyRepository?.searchRaw(query).return.all()) ?? []) as BodyRecord[]

    if (bodyRecord === null || bodyRecord === undefined) return Body.empty()

    return Body.create({
      id: ID.create({value: bodyRecord[EntityId] as string}),
      userID: ID.create({value: bodyRecord.userID}),
      bookID: ID.create({value: bodyRecord.bookID}),
      chapterID: ID.create({value: bodyRecord.chapterID}),
      content: bodyRecord.content,
      createdAt: TimeStamp.create({value: bodyRecord.createdAt}),
      hash: Hash.create({value: bodyRecord.hash})
    })
  }

  async findByID(id: ID, userID: ID): Promise<Body> {
    await this.#createIndex()

    const bodyRecord = (await this.#bodyRepository?.fetch(id.value)) as BodyRecord

    if (bodyRecord === null || bodyRecord === undefined) return Body.empty()
    if (bodyRecord.userID !== userID.value) return Body.empty()

    return Body.create({
      id: ID.create({value: bodyRecord[EntityId] as string}),
      userID: ID.create({value: bodyRecord.userID}),
      bookID: ID.create({value: bodyRecord.bookID}),
      chapterID: ID.create({value: bodyRecord.chapterID}),
      content: bodyRecord.content,
      createdAt: TimeStamp.create({value: bodyRecord.createdAt})
    })
  }

  async findAll(userID: ID, bookID: ID, chapterID: ID): Promise<Bodies> {
    await this.#createIndex()

    const query = `@userID:{${userID.value}} @bookID:{${bookID.value}} @chapterID:{${chapterID.value}}`

    const bodiesRecords = (await this.#bodyRepository
      ?.searchRaw(query)
      .sortBy('createdAt', 'DESC')
      .return.all()) as BodyRecord[]

    if (bodiesRecords === null || bodiesRecords === undefined) return Bodies.empty()

    return Bodies.create({
      bodies: bodiesRecords.map(bodyRecord =>
        Body.create({
          id: ID.create({value: bodyRecord[EntityId] as string}),
          userID: ID.create({value: bodyRecord.userID}),
          bookID: ID.create({value: bodyRecord.bookID}),
          chapterID: ID.create({value: bodyRecord.chapterID}),
          content: bodyRecord.content,
          createdAt: TimeStamp.create({value: bodyRecord.createdAt})
        })
      )
    })
  }

  async removeByChapterID(id: ID, userID: ID): Promise<Bodies> {
    await this.#createIndex()

    const bodiesRecords = (await this.#bodyRepository
      ?.searchRaw(`@userID:{${userID.value}} @chapterID:{${id.value}}`)
      .return.all()) as BodyRecord[]

    if (!bodiesRecords) return Bodies.empty()

    await Promise.all(
      bodiesRecords.map(async bodyRecord => this.#bodyRepository?.remove(bodyRecord[EntityId] as string))
    )

    return Bodies.empty()
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#bodyRepository = new Repository(bodySchema, client)
    this.#indexCreated = true
    return this.#bodyRepository.createIndex()
  }
}
