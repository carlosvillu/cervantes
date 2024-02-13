import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Chapter} from '../Models/Chapter.js'
import {Summary} from '../Models/Summary.js'
import {Title} from '../Models/Title.js'
import {ChapterRepository} from '../Repositories/ChapterRepository.js'
import {RedisChapterRepository} from '../Repositories/RedisChapterRepository/index.js'

export interface UpdateChapterUseCaseInput {
  title: string
  summary: string
  id: string
  userID: string
  bookID: string
  createdAt: string
}

export class UpdateChapterUseCase implements UseCase<UpdateChapterUseCaseInput, Chapter> {
  static create() {
    return new UpdateChapterUseCase(RedisChapterRepository.create())
  }

  constructor(private readonly repository: ChapterRepository) {}

  async execute({title, userID, bookID, summary, id, createdAt}: UpdateChapterUseCaseInput): Promise<Chapter> {
    const chapter = this.repository.create(
      Chapter.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        bookID: ID.create({value: bookID}),
        title: Title.create({value: title}),
        summary: Summary.create({value: summary}),
        createdAt: TimeStamp.create({value: +createdAt})
      })
    )

    return chapter
  }
}
