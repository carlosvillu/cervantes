import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapter} from '../Models/Chapter.js'
import {Summary} from '../Models/Summary.js'
import {Title} from '../Models/Title.js'
import {ChapterRepository} from '../Repositories/ChapterRepository.js'
import {RedisChapterRepository} from '../Repositories/RedisChapterRepository/index.js'

export interface CreateChapterUseCaseInput {
  title: string
  summary: string
  id: string
  userID: string
  bookID: string
  isRoot: boolean
}

export class CreateChapterUseCase implements UseCase<CreateChapterUseCaseInput, Chapter> {
  static create() {
    return new CreateChapterUseCase(RedisChapterRepository.create())
  }

  constructor(private readonly repository: ChapterRepository) {}

  async execute({title, userID, bookID, summary, id, isRoot}: CreateChapterUseCaseInput): Promise<Chapter> {
    return this.repository.create(
      Chapter.create({
        id: ID.create({value: id}),
        userID: ID.create({value: userID}),
        bookID: ID.create({value: bookID}),
        title: Title.create({value: title}),
        summary: Summary.create({value: summary}),
        isRoot
      })
    )
  }
}
