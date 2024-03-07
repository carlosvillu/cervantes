import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {ChapterCover} from '../Models/ChapterCover.js'
import {ImageRepository} from '../Repositories/ImageRepository.js'
import {RedisImageRepository} from '../Repositories/RedisImageRepository/index.js'

export interface FindChapterCoverByChapterIDImageUseCaseInput {
  userID: string
  bookID: string
  chapterID: string
}

export class FindChapterCoverByChapterIDImageUseCase
  implements UseCase<FindChapterCoverByChapterIDImageUseCaseInput, ChapterCover>
{
  static create() {
    return new FindChapterCoverByChapterIDImageUseCase(RedisImageRepository.create())
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({userID, bookID, chapterID}: FindChapterCoverByChapterIDImageUseCaseInput): Promise<ChapterCover> {
    return this.repository.findChapterCover(
      ID.create({value: chapterID}),
      ID.create({value: bookID}),
      ID.create({value: userID})
    )
  }
}
