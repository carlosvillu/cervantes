import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapter} from '../Models/Chapter.js'
import {ChapterRepository} from '../Repositories/ChapterRepository.js'
import {RedisChapterRepository} from '../Repositories/RedisChapterRepository/index.js'

export interface GetRootChapterUseCaseInput {
  bookID: string
  userID: string
}

export class GetRootChapterUseCase implements UseCase<GetRootChapterUseCaseInput, Chapter> {
  static create() {
    return new GetRootChapterUseCase(RedisChapterRepository.create())
  }

  constructor(private readonly repository: ChapterRepository) {}

  async execute({userID, bookID}: GetRootChapterUseCaseInput): Promise<Chapter> {
    return this.repository.getRootChapter(ID.create({value: userID}), ID.create({value: bookID}))
  }
}
