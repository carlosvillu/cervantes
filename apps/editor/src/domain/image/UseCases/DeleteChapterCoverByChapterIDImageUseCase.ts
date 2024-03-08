import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.ts'
import {ChapterCover} from '../Models/ChapterCover.ts'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import type {ImageRepository} from '../Repositories/ImageRepository.js'

export interface DeleteChapterCoverByChapterIDImageUseCaseInput {
  bookID: string
  chapterID: string
}

export class DeleteChapterCoverByChapterIDImageUseCase
  implements UseCase<DeleteChapterCoverByChapterIDImageUseCaseInput, ChapterCover>
{
  static create({config}: {config: Config}) {
    return new DeleteChapterCoverByChapterIDImageUseCase(HTTPImageRepository.create(config))
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({bookID, chapterID}: DeleteChapterCoverByChapterIDImageUseCaseInput): Promise<ChapterCover> {
    return this.repository.deleteChapterCoverByChapterID(ID.create({value: chapterID}), ID.create({value: bookID}))
  }
}
