import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {BookCover} from '../Models/BookCover.js'
import {Key} from '../Models/Key.js'
import {ImageRepository} from '../Repositories/ImageRepository.js'
import {RedisImageRepository} from '../Repositories/RedisImageRepository/index.js'

export interface CreateBookCoverImageUseCaseInput {
  id: string
  userID: string
  bookID: string
  key: string
}

export class CreateBookCoverImageUseCase implements UseCase<CreateBookCoverImageUseCaseInput, BookCover> {
  static create() {
    return new CreateBookCoverImageUseCase(RedisImageRepository.create())
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({id, userID, bookID, key}: CreateBookCoverImageUseCaseInput): Promise<BookCover> {
    return this.repository.createBookCover(
      BookCover.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        bookID: ID.create({value: bookID}),
        key: Key.create({value: key}),
        createdAt: TimeStamp.now()
      })
    )
  }
}
