/* eslint @typescript-eslint/no-non-null-assertion:0 */

import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import {ID} from '../../../_kernel/ID.js'
import {TimeStamp} from '../../../_kernel/TimeStamp.js'
import {Redis} from '../../../_redis/index.js'
import {Chapter} from '../../Models/Chapter.js'
import {Chapters} from '../../Models/Chapters.js'
import {Summary} from '../../Models/Summary.js'
import {Title} from '../../Models/Title.js'
import {ChapterRepository} from '../ChapterRepository.js'
import {ChapterRecord, chapterSchema} from './schemas.js'

export class RedisChapterRepository implements ChapterRepository {
  #indexCreated = false
  #chapterRepository: Repository | undefined = undefined

  static create() {
    return new RedisChapterRepository()
  }

  async create(chapter: Chapter): Promise<Chapter> {
    if (chapter.isEmpty()) return chapter

    await this.#createIndex()

    const chapterRecord = (await this.#chapterRepository?.save(chapter.id!, chapter.attributes())) as ChapterRecord

    if (chapterRecord === null || chapterRecord === undefined) return Chapter.empty()
    return chapter
  }

  async update(chapter: Chapter): Promise<Chapter> {
    if (chapter.isEmpty()) return chapter

    await this.#createIndex()

    const chapterRecord = (await this.#chapterRepository?.save(chapter.id!, chapter.attributes())) as ChapterRecord

    if (chapterRecord === null || chapterRecord === undefined) return Chapter.empty()
    return chapter
  }

  async findByID(id: ID, userID: ID, bookID: ID): Promise<Chapter> {
    await this.#createIndex()

    const chapterRecord = (await this.#chapterRepository?.fetch(id.value)) as ChapterRecord

    if (chapterRecord === null || chapterRecord === undefined) return Chapter.empty()
    if (chapterRecord.userID !== userID.value) return Chapter.empty()
    if (chapterRecord.bookID !== bookID.value) return Chapter.empty()

    return Chapter.create({
      id: ID.create({value: chapterRecord[EntityId] as string}),
      summary: Summary.create({value: chapterRecord.summary}),
      title: Title.create({value: chapterRecord.title}),
      userID: ID.create({value: chapterRecord.userID}),
      bookID: ID.create({value: chapterRecord.bookID}),
      createdAt: TimeStamp.create({value: chapterRecord.createdAt}),
      ...(chapterRecord.updatedAt && {updatedAt: TimeStamp.create({value: chapterRecord.updatedAt})})
    })
  }

  async findAll(userID: ID, bookID: ID): Promise<Chapters> {
    await this.#createIndex()

    const chaptersRecords = (await this.#chapterRepository
      ?.searchRaw(`@userID:{${userID.value} @bookID:{${bookID.value}}`)
      .return.all()) as ChapterRecord[]

    if (chaptersRecords === null || chaptersRecords === undefined) return Chapters.empty()

    return Chapters.create({
      chapters: chaptersRecords.map(record =>
        Chapter.create({
          id: ID.create({value: record[EntityId] as string}),
          title: Title.create({value: record.title}),
          summary: Summary.create({value: record.summary}),
          createdAt: TimeStamp.create({value: record.createdAt}),
          userID: ID.create({value: record.userID}),
          bookID: ID.create({value: record.bookID}),
          ...(record.updatedAt && {updatedAt: TimeStamp.create({value: record.updatedAt})})
        })
      )
    })
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#chapterRepository = new Repository(chapterSchema, client)
    this.#indexCreated = true
    return this.#chapterRepository.createIndex()
  }
}
