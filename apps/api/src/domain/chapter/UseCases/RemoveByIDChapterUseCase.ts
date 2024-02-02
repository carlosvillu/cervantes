import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Chapter} from '../Models/Chapter.js'
import {ChapterRepository} from '../Repositories/ChapterRepository.js'
import {RedisChapterRepository} from '../Repositories/RedisChapterRepository/index.js'

export interface RemoveByIDChapterUseCaseInput {
  id: string
  userID: string
}

export class RemoveByIDChapterUseCase implements UseCase<RemoveByIDChapterUseCaseInput, Chapter> {
  static create() {
    return new RemoveByIDChapterUseCase(RedisChapterRepository.create())
  }

  constructor(private readonly repository: ChapterRepository) {}

  async execute({id, userID}: RemoveByIDChapterUseCaseInput): Promise<Chapter> {
    return this.repository.removeByID(ID.create({value: id}), ID.create({value: userID}))
  }
}
