import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Book} from '../Models/Book.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {RedisBookRepository} from '../Repository/RedisBookRepository/index.js'

export interface FindByIDBookUseCaseInput {
  id: string
  userID: string
}

export class FindByIDBookUseCase implements UseCase<FindByIDBookUseCaseInput, Book> {
  static create({config}: {config: Config}) {
    return new FindByIDBookUseCase(config, RedisBookRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: BookRepository) {}

  async execute({id, userID}: FindByIDBookUseCaseInput): Promise<Book> {
    return this.repository.findByID(ID.create({value: id}), ID.create({value: userID}))
  }
}
