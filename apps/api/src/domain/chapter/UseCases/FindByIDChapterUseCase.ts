import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapter} from '../Models/Chapter.js'
import {ChapterRepository} from '../Repositories/ChapterRepository.js'
import {RedisChapterRepository} from '../Repositories/RedisChapterRepository/index.js'

export interface FindByIDChapterUseCaseInput {
  id: string
  userID: string
  bookID: string
}

export class FindByIDChapterUseCase implements UseCase<FindByIDChapterUseCaseInput, Chapter> {
  static create() {
    return new FindByIDChapterUseCase(RedisChapterRepository.create())
  }

  constructor(private readonly repository: ChapterRepository) {}

  async execute({id, userID, bookID}: FindByIDChapterUseCaseInput): Promise<Chapter> {
    return this.repository.findByID(ID.create({value: id}), ID.create({value: userID}), ID.create({value: bookID}))
  }
}
