import {Cache, CacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Book} from '../Models/Book.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {HTTPBookRepository} from '../Repository/HTTPBookRepository'

export interface FindByIDBookUseCaseInput {
  id: string
}

export class FindByIDBookUseCase implements UseCase<FindByIDBookUseCaseInput, Book> {
  static create({config}: {config: Config}) {
    return new FindByIDBookUseCase(HTTPBookRepository.create(config))
  }

  constructor(private readonly repository: BookRepository) {}

  @Cache({
    name: 'FindByIDBookUseCase',
    ttl: Number.MAX_SAFE_INTEGER,
    references(_args, _key, result) {
      return ['book:' + result.id]
    }
  } as const as CacheConfig<Book>)
  async execute({id}: FindByIDBookUseCaseInput): Promise<Book> {
    return this.repository.findByID(ID.create({value: id}))
  }
}
