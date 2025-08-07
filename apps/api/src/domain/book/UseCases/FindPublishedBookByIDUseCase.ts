import {UseCase} from '../../_kernel/UseCase.js'
import {ID} from '../../_kernel/ID.js'
import {Book} from '../Models/Book.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {RedisBookRepository} from '../Repository/RedisBookRepository/index.js'

export class FindPublishedBookByIDUseCase implements UseCase<{id: string}, Book> {
  static create() {
    return new FindPublishedBookByIDUseCase(RedisBookRepository.create())
  }

  constructor(private readonly repository: BookRepository) {}

  async execute({id}: {id: string}): Promise<Book> {
    return this.repository.findPublishedByID(ID.create({value: id}))
  }
}
