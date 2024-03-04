import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.ts'
import {BookCover} from '../Models/BookCover.ts'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import type {ImageRepository} from '../Repositories/ImageRepository.js'

export interface FindBookCoverByBookIDImageUseCaseInput {
  bookID: string
}

export class FindBookCoverByBookIDImageUseCase implements UseCase<FindBookCoverByBookIDImageUseCaseInput, BookCover> {
  static create({config}: {config: Config}) {
    return new FindBookCoverByBookIDImageUseCase(HTTPImageRepository.create(config))
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({bookID}: FindBookCoverByBookIDImageUseCaseInput): Promise<BookCover> {
    return this.repository.findBookCoverByBookID(ID.create({value: bookID}))
  }
}
