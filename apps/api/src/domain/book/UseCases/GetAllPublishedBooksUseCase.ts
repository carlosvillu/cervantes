import {UseCase} from '../../_kernel/UseCase.js'
import {Books} from '../Models/Books.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {RedisBookRepository} from '../Repository/RedisBookRepository/index.js'

export class GetAllPublishedBooksUseCase implements UseCase<void, Books> {
  static create() {
    return new GetAllPublishedBooksUseCase(RedisBookRepository.create())
  }

  constructor(private readonly repository: BookRepository) {}

  async execute(): Promise<Books> {
    return this.repository.findAllPublished()
  }
}
