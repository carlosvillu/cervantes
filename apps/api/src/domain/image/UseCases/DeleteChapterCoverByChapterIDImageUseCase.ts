import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {ChapterCover} from '../Models/ChapterCover.js'
import {ImageRepository} from '../Repositories/ImageRepository.js'
import {RedisImageRepository} from '../Repositories/RedisImageRepository/index.js'

export interface DeleteChapterCoverByChapterIDImageUseCaseInput {
  userID: string
  bookID: string
  chapterID: string
}

export class DeleteChapterCoverByChapterIDImageUseCase
  implements UseCase<DeleteChapterCoverByChapterIDImageUseCaseInput, ChapterCover>
{
  static create() {
    return new DeleteChapterCoverByChapterIDImageUseCase(RedisImageRepository.create())
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({userID, bookID, chapterID}: DeleteChapterCoverByChapterIDImageUseCaseInput): Promise<ChapterCover> {
    return this.repository.deleteChapterCover(
      ID.create({value: chapterID}),
      ID.create({value: bookID}),
      ID.create({value: userID})
    )
  }
}
