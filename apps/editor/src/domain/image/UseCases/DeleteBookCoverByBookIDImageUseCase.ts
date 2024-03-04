import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.ts'
import {BookCover} from '../Models/BookCover.ts'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import type {ImageRepository} from '../Repositories/ImageRepository.js'

export interface DeleteBookCoverByBookIDImageUseCaseInput {
  bookID: string
}

export class DeleteBookCoverByBookIDImageUseCase
  implements UseCase<DeleteBookCoverByBookIDImageUseCaseInput, BookCover>
{
  static create({config}: {config: Config}) {
    return new DeleteBookCoverByBookIDImageUseCase(HTTPImageRepository.create(config))
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({bookID}: DeleteBookCoverByBookIDImageUseCaseInput): Promise<BookCover> {
    return this.repository.deleteBookCoverByBookID(ID.create({value: bookID}))
  }
}
