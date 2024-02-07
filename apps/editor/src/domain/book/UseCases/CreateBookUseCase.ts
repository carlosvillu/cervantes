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

export interface CreateBookUseCaseInput {
  title: string
  summary: string
  id: string
  userID: string
}

export class CreateBookUseCase implements UseCase<CreateBookUseCaseInput, Book> {
  static create({config}: {config: Config}) {
    return new CreateBookUseCase(HTTPBookRepository.create(config))
  }

  constructor(private readonly repository: BookRepository) {}

  @InvalidateCache({
    references(_arg: CreateBookUseCaseInput, _result) {
      return ['book:all']
    }
  } as const as InvalidateCacheConfig<Book>)
  async execute({title, userID, summary, id}: CreateBookUseCaseInput): Promise<Book> {
    return this.repository.create(
      Book.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        title: Title.create({value: title}),
        summary: Summary.create({value: summary}),
        published: PublishStatus.create({value: false}),
        createdAt: TimeStamp.now()
      })
    )
  }
}
