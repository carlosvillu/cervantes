/* eslint @typescript-eslint/no-non-null-assertion:0 */

import type {RedisClientType} from 'redis'
import {EntityId, Repository} from 'redis-om'

import {ID} from '../../../_kernel/ID.js'
import {TimeStamp} from '../../../_kernel/TimeStamp.js'
import {Redis} from '../../../_redis/index.js'
import {Book} from '../../Models/Book.js'
import {Books} from '../../Models/Books.js'
import {PublishStatus} from '../../Models/PublishStatud.js'
import {Summary} from '../../Models/Summary.js'
import {Title} from '../../Models/Title.js'
import {BookRepository} from '../BookRepository.js'
import {BookRecord, bookSchema} from './schemas.js'

export class RedisBookRepository implements BookRepository {
  #indexCreated = false
  #bookRepository: Repository | undefined = undefined

  static create() {
    return new RedisBookRepository()
  }

  async create(book: Book): Promise<Book> {
    if (book.isEmpty()) return book

    await this.#createIndex()

    const bookRecord = await this.#bookRepository?.save(book.id!, book.attributes())

    if (bookRecord === null || bookRecord === undefined) return Book.empty()
    return book
  }

  async update(book: Book): Promise<Book> {
    if (book.isEmpty()) return book

    await this.#createIndex()

    const bookRecord = await this.#bookRepository?.save(book.id!, book.attributes())

    if (bookRecord === null || bookRecord === undefined) return Book.empty()
    return book
  }

  async findByID(id: ID, userID: ID): Promise<Book> {
    await this.#createIndex()

    const bookRecord = (await this.#bookRepository?.fetch(id.value)) as BookRecord

    if (bookRecord === null || bookRecord === undefined) return Book.empty()
    if (bookRecord.userID !== userID.value) return Book.empty()

    return Book.create({
      id: ID.create({value: bookRecord[EntityId] as string}),
      summary: Summary.create({value: bookRecord.summary}),
      published: PublishStatus.create({value: bookRecord.published ?? false}),
      title: Title.create({value: bookRecord.title}),
      userID: ID.create({value: bookRecord.userID}),
      rootChapterID: bookRecord.rootChapterID ? ID.create({value: bookRecord.rootChapterID}) : ID.empty(),
      createdAt: TimeStamp.create({value: bookRecord.createdAt}),
      ...(bookRecord.updaedAt && {updatedAt: TimeStamp.create({value: bookRecord.updatedAt})})
    })
  }

  async findAll(userID: ID): Promise<Books> {
    await this.#createIndex()

    const booksRecords = (await this.#bookRepository
      ?.search()
      .where('userID')
      .equal(userID.value)
      .return.all()) as BookRecord[]

    if (booksRecords === null || booksRecords === undefined) return Books.empty()

    return Books.create({
      books: booksRecords.map(record =>
        Book.create({
          id: ID.create({value: record[EntityId] as string}),
          title: Title.create({value: record.title}),
          summary: Summary.create({value: record.summary}),
          published: PublishStatus.create({value: record.published ?? false}),
          createdAt: TimeStamp.create({value: record.createdAt}),
          userID: ID.create({value: record.userID}),
          rootChapterID: record.rootChapterID ? ID.create({value: record.rootChapterID}) : ID.empty(),
          ...(record.updaedAt && {updatedAt: TimeStamp.create({value: record.updatedAt})})
        })
      )
    })
  }

  async #createIndex() {
    if (this.#indexCreated) return

    const client = (await Redis.create().createAndConnectClient()) as RedisClientType

    this.#bookRepository = new Repository(bookSchema, client)
    this.#indexCreated = true
    return this.#bookRepository.createIndex()
  }
}
