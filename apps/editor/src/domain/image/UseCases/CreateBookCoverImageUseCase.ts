import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.ts'
import {BookCover} from '../Models/BookCover.ts'
import {Key} from '../Models/Key.ts'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import type {ImageRepository} from '../Repositories/ImageRepository.js'

export interface CreateBookCoverImageUseCaseInput {
  key: string
  bookID: string
}

export class CreateBookCoverImageUseCase implements UseCase<CreateBookCoverImageUseCaseInput, BookCover> {
  static create({config}: {config: Config}) {
    return new CreateBookCoverImageUseCase(HTTPImageRepository.create(config))
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({bookID, key}: CreateBookCoverImageUseCaseInput): Promise<BookCover> {
    return this.repository.createBookCover(
      BookCover.create({
        id: ID.random(),
        bookID: ID.create({value: bookID}),
        key: Key.create({value: key})
      })
    )
  }
}
