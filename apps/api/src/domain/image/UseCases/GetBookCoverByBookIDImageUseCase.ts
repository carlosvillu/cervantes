import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {BookCover} from '../Models/BookCover.js'
import {ImageRepository} from '../Repositories/ImageRepository.js'
import {RedisImageRepository} from '../Repositories/RedisImageRepository/index.js'

export interface GetBookCoverByBookIDImageUseCaseInput {
  userID: string
  bookID: string
}

export class GetBookCoverByBookIDImageUseCase implements UseCase<GetBookCoverByBookIDImageUseCaseInput, BookCover> {
  static create() {
    return new GetBookCoverByBookIDImageUseCase(RedisImageRepository.create())
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({userID, bookID}: GetBookCoverByBookIDImageUseCaseInput): Promise<BookCover> {
    return this.repository.getBookCover(ID.create({value: bookID}), ID.create({value: userID}))
  }
}
