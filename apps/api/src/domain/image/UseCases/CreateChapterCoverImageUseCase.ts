import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {ChapterCover} from '../Models/ChapterCover.js'
import {Key} from '../Models/Key.js'
import {ImageRepository} from '../Repositories/ImageRepository.js'
import {RedisImageRepository} from '../Repositories/RedisImageRepository/index.js'

export interface CreateChapterCoverImageUseCaseInput {
  id: string
  userID: string
  bookID: string
  chapterID: string
  key: string
}

export class CreateChapterCoverImageUseCase implements UseCase<CreateChapterCoverImageUseCaseInput, ChapterCover> {
  static create() {
    return new CreateChapterCoverImageUseCase(RedisImageRepository.create())
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({id, userID, bookID, chapterID, key}: CreateChapterCoverImageUseCaseInput): Promise<ChapterCover> {
    return this.repository.createChapterCover(
      ChapterCover.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        bookID: ID.create({value: bookID}),
        chapterID: ID.create({value: chapterID}),
        key: Key.create({value: key}),
        createdAt: TimeStamp.now()
      })
    )
  }
}
