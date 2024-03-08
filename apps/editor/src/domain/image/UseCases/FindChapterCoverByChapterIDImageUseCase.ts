import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.ts'
import {ChapterCover} from '../Models/ChapterCover.ts'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import type {ImageRepository} from '../Repositories/ImageRepository.js'

export interface FindChapterCoverByChapterIDImageUseCaseInput {
  bookID: string
  chapterID: string
}

export class FindChapterCoverByChapterIDImageUseCase
  implements UseCase<FindChapterCoverByChapterIDImageUseCaseInput, ChapterCover>
{
  static create({config}: {config: Config}) {
    return new FindChapterCoverByChapterIDImageUseCase(HTTPImageRepository.create(config))
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({bookID, chapterID}: FindChapterCoverByChapterIDImageUseCaseInput): Promise<ChapterCover> {
    return this.repository.findChapterCoverByChapterID(ID.create({value: chapterID}), ID.create({value: bookID}))
  }
}
