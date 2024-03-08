import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.ts'
import {ChapterCover} from '../Models/ChapterCover.ts'
import {Key} from '../Models/Key.ts'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import type {ImageRepository} from '../Repositories/ImageRepository.js'

export interface CreateChapterCoverImageUseCaseInput {
  key: string
  bookID: string
  chapterID: string
}

export class CreateChapterCoverImageUseCase implements UseCase<CreateChapterCoverImageUseCaseInput, ChapterCover> {
  static create({config}: {config: Config}) {
    return new CreateChapterCoverImageUseCase(HTTPImageRepository.create(config))
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({chapterID, bookID, key}: CreateChapterCoverImageUseCaseInput): Promise<ChapterCover> {
    return this.repository.createChapterCover(
      ChapterCover.create({
        id: ID.random(),
        bookID: ID.create({value: bookID}),
        chapterID: ID.create({value: chapterID}),
        key: Key.create({value: key})
      })
    )
  }
}
