import {InvalidateCache, InvalidateCacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Book} from '../Models/Book.js'
import {PublishStatus} from '../Models/PublishStatus.js'
import {Summary} from '../Models/Summary.js'
import {Title} from '../Models/Title.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {HTTPBookRepository} from '../Repository/HTTPBookRepository'

export interface UpdateBookUseCaseInput {
  title: string
  summary: string
  published: boolean
  id: string
  userID: string
  rootChapterID?: string
  createdAt: string
}

export class UpdateBookUseCase implements UseCase<UpdateBookUseCaseInput, Book> {
  static create({config}: {config: Config}) {
    return new UpdateBookUseCase(HTTPBookRepository.create(config))
  }

  constructor(private readonly repository: BookRepository) {}

  @InvalidateCache({
    references(_arg: UpdateBookUseCaseInput, result) {
      return ['book:' + result.id, 'book:all']
    }
  } as const as InvalidateCacheConfig<Book>)
  async execute({
    title,
    userID,
    published,
    summary,
    id,
    rootChapterID,
    createdAt
  }: UpdateBookUseCaseInput): Promise<Book> {
    return this.repository.update(
      Book.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        title: Title.create({value: title}),
        summary: Summary.create({value: summary}),
        published: PublishStatus.create({value: published}),
        rootChapterID: rootChapterID ? ID.create({value: rootChapterID}) : ID.empty(),
        createdAt: TimeStamp.create({value: +createdAt})
      })
    )
  }
}
