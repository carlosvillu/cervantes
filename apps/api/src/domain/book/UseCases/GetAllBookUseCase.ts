import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Books} from '../Models/Books.js'
import {BookRepository} from '../Repository/BookRepository.js'
import {RedisBookRepository} from '../Repository/RedisBookRepository/index.js'

export interface GetAllBookUseCaseInput {
  userID: string
}

export class GetAllBookUseCase implements UseCase<GetAllBookUseCaseInput, Books> {
  static create() {
    return new GetAllBookUseCase(RedisBookRepository.create())
  }

  constructor(private readonly repository: BookRepository) {}

  async execute({userID}: GetAllBookUseCaseInput): Promise<Books> {
    return this.repository.findAll(ID.create({value: userID}))
  }
}
