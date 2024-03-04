import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {BookCover} from '../Models/BookCover.js'
import {ImageRepository} from '../Repositories/ImageRepository.js'
import {RedisImageRepository} from '../Repositories/RedisImageRepository/index.js'

export interface DeleteBookCoverByBookIDImageUseCaseInput {
  userID: string
  bookID: string
}

export class DeleteBookCoverByBookIDImageUseCase
  implements UseCase<DeleteBookCoverByBookIDImageUseCaseInput, BookCover>
{
  static create() {
    return new DeleteBookCoverByBookIDImageUseCase(RedisImageRepository.create())
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({userID, bookID}: DeleteBookCoverByBookIDImageUseCaseInput): Promise<BookCover> {
    return this.repository.deleteBookCover(ID.create({value: bookID}), ID.create({value: userID}))
  }
}
