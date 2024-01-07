import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Book} from '../Models/Book.js'
import {Summary} from '../Models/Summary.js'
import {Title} from '../Models/Title.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {RedisBookRepository} from '../Repository/RedisBookRepository/index.js'

export interface CreateBookUseCaseInput {
  title: string
  summary: string
  id: string
  userID: string
}

export class CreateBookUseCase implements UseCase<CreateBookUseCaseInput, Book> {
  static create({config}: {config: Config}) {
    return new CreateBookUseCase(config, RedisBookRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: BookRepository) {}

  async execute({title, userID, summary, id}: CreateBookUseCaseInput): Promise<Book> {
    return this.repository.create(
      Book.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        title: Title.create({value: title}),
        summary: Summary.create({value: summary})
      })
    )
  }
}
