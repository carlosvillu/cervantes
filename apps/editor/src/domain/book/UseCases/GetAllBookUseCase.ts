import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {Books} from '../Models/Books.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {HTTPBookRepository} from '../Repository/HTTPBookRepository.js'

export class GetAllBookUseCase implements UseCase<void, Books> {
  static create({config}: {config: Config}) {
    return new GetAllBookUseCase(config, HTTPBookRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: BookRepository) {}

  async execute(): Promise<Books> {
    return this.repository.findAll()
  }
}
