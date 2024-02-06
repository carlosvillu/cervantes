import {Cache, CacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {Books} from '../Models/Books.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {HTTPBookRepository} from '../Repository/HTTPBookRepository'

export class GetAllBookUseCase implements UseCase<void, Books> {
  static create({config}: {config: Config}) {
    return new GetAllBookUseCase(HTTPBookRepository.create(config))
  }

  constructor(private readonly repository: BookRepository) {}

  @Cache({
    name: 'GetAllBookUseCase',
    ttl: Number.MAX_SAFE_INTEGER,
    references(_args, _key, _result) {
      return ['book:all']
    }
  } as const as CacheConfig<Books>)
  async execute(): Promise<Books> {
    return this.repository.findAll()
  }
}
