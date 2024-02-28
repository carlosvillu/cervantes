import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {BookCover} from '../Models/BookCover.js'
import {ImageRepository} from '../Repositories/ImageRepository.js'
import {RedisImageRepository} from '../Repositories/RedisImageRepository/index.js'

export interface FindBookCoverByBookIDImageUseCaseInput {
  userID: string
  bookID: string
}

export class FindBookCoverByBookIDImageUseCase implements UseCase<FindBookCoverByBookIDImageUseCaseInput, BookCover> {
  static create() {
    return new FindBookCoverByBookIDImageUseCase(RedisImageRepository.create())
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({userID, bookID}: FindBookCoverByBookIDImageUseCaseInput): Promise<BookCover> {
    return this.repository.findBookCover(ID.create({value: bookID}), ID.create({value: userID}))
  }
}
