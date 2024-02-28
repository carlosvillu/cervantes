/* eslint @typescript-eslint/no-non-null-assertion:0 */

import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import {ID} from '../../../_kernel/ID.js'
import {TimeStamp} from '../../../_kernel/TimeStamp.js'
import {Redis} from '../../../_redis/index.js'
import {BookCover} from '../../Models/BookCover.js'
import {Key} from '../../Models/Key.js'
import {ImageRepository} from '../ImageRepository.js'
import {BookCoverRecord, bookCoverSchema} from './schemas.js'

export class RedisImageRepository implements ImageRepository {
  #indexCreated = false
  #bookCoverRepository: Repository | undefined = undefined

  static create() {
    return new RedisImageRepository()
  }

  async createBookCover(cover: BookCover): Promise<BookCover> {
    if (cover.isEmpty()) return cover

    await this.#createIndex()

    const currentbookCoverRecord = (await this.#bookCoverRepository
      ?.searchRaw(`@userID:{${cover.userID!}} @bookID:{${cover.bookID!}}`)
      .return.first()) as BookCoverRecord

    if (currentbookCoverRecord) return BookCover.empty()

    const bookCoverRecord = await this.#bookCoverRepository?.save(cover.id!, cover.attributes())

    if (bookCoverRecord === null || bookCoverRecord === undefined) return BookCover.empty()
    return cover
  }

  async findBookCover(bookID: ID, userID: ID): Promise<BookCover> {
    await this.#createIndex()

    const bookCoverRecord = (await this.#bookCoverRepository
      ?.searchRaw(`@userID:{${userID.value}} @bookID:{${bookID.value}}`)
      .return.first()) as BookCoverRecord

    if (!bookCoverRecord) return BookCover.empty()

    return BookCover.create({
      id: ID.create({value: bookCoverRecord[EntityId] as string}),
      bookID: ID.create({value: bookCoverRecord.bookID}),
      userID: ID.create({value: bookCoverRecord.userID}),
      key: Key.create({value: bookCoverRecord.key}),
      createdAt: TimeStamp.create({value: bookCoverRecord.createdAt}),
      updatedAt: TimeStamp.create({value: bookCoverRecord.updatedAt})
    })
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#bookCoverRepository = new Repository(bookCoverSchema, client)
    this.#indexCreated = true
    return this.#bookCoverRepository.createIndex()
  }
}
