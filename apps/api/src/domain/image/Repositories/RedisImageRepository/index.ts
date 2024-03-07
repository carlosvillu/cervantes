/* eslint @typescript-eslint/no-non-null-assertion:0 */

import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import {ID} from '../../../_kernel/ID.js'
import {TimeStamp} from '../../../_kernel/TimeStamp.js'
import {Redis} from '../../../_redis/index.js'
import {BookCover} from '../../Models/BookCover.js'
import {ChapterCover} from '../../Models/ChapterCover.js'
import {Key} from '../../Models/Key.js'
import {ImageRepository} from '../ImageRepository.js'
import {BookCoverRecord, bookCoverSchema, ChapterCoverRecord, chapterCoverSchema} from './schemas.js'

export class RedisImageRepository implements ImageRepository {
  #indexCreated = false
  #bookCoverRepository: Repository | undefined = undefined
  #chapterCoverRepository: Repository | undefined = undefined

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

  async createChapterCover(cover: ChapterCover): Promise<ChapterCover> {
    if (cover.isEmpty()) return cover

    await this.#createIndex()

    const currentchapterCoverRecord = (await this.#chapterCoverRepository
      ?.searchRaw(`@userID:{${cover.userID!}} @bookID:{${cover.bookID!}} @chapterID:{${cover.chapterID!}}`)
      .return.first()) as BookCoverRecord

    if (currentchapterCoverRecord) return ChapterCover.empty()

    const chapterCoverRecord = (await this.#chapterCoverRepository?.save(
      cover.id!,
      cover.attributes()
    )) as ChapterCoverRecord

    if (chapterCoverRecord === null || chapterCoverRecord === undefined) return ChapterCover.empty()
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

  async findChapterCover(chapterID: ID, bookID: ID, userID: ID): Promise<ChapterCover> {
    await this.#createIndex()

    const chapterCoverRecord = (await this.#chapterCoverRepository
      ?.searchRaw(`@userID:{${userID.value}} @bookID:{${bookID.value}} @chapterID:{${chapterID.value}}`)
      .return.first()) as ChapterCoverRecord

    if (!chapterCoverRecord) return ChapterCover.empty()

    return ChapterCover.create({
      id: ID.create({value: chapterCoverRecord[EntityId] as string}),
      bookID: ID.create({value: chapterCoverRecord.bookID}),
      chapterID: ID.create({value: chapterCoverRecord.chapterID}),
      userID: ID.create({value: chapterCoverRecord.userID}),
      key: Key.create({value: chapterCoverRecord.key}),
      createdAt: TimeStamp.create({value: chapterCoverRecord.createdAt}),
      updatedAt: TimeStamp.create({value: chapterCoverRecord.updatedAt})
    })
  }

  async deleteBookCover(bookID: ID, userID: ID): Promise<BookCover> {
    await this.#createIndex()

    const bookCoverRecord = (await this.#bookCoverRepository
      ?.searchRaw(`@userID:{${userID.value}} @bookID:{${bookID.value}}`)
      .return.first()) as BookCoverRecord

    if (!bookCoverRecord) return BookCover.empty()

    await this.#bookCoverRepository?.remove(bookCoverRecord[EntityId]!)

    return BookCover.empty()
  }

  async deleteChapterCover(chapterID: ID, bookID: ID, userID: ID): Promise<ChapterCover> {
    await this.#createIndex()

    const chaperCoverRecord = (await this.#chapterCoverRepository
      ?.searchRaw(`@userID:{${userID.value}} @bookID:{${bookID.value}} @chapterID:{${chapterID.value}}`)
      .return.first()) as ChapterCoverRecord

    if (!chaperCoverRecord) return ChapterCover.empty()

    await this.#chapterCoverRepository?.remove(chaperCoverRecord[EntityId]!)

    return ChapterCover.empty()
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#bookCoverRepository = new Repository(bookCoverSchema, client)
    this.#chapterCoverRepository = new Repository(chapterCoverSchema, client)
    this.#indexCreated = true
    await this.#bookCoverRepository.createIndex()
    await this.#chapterCoverRepository.createIndex()
  }
}
