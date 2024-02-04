import {Broker} from '../../_broker/index.js'
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
    return new RemoveByIDChapterUseCase(RedisChapterRepository.create(), Broker.create())
  }

  constructor(private readonly repository: ChapterRepository, private readonly broker: Broker) {}

  async execute({id: sID, userID: sUserID}: RemoveByIDChapterUseCaseInput): Promise<Chapter> {
    const id = ID.create({value: sID})
    const userID = ID.create({value: sUserID})

    const chapter = this.repository.removeByID(id, userID)

    await this.broker.emit({type: 'delete_chapter', payload: {id, userID}})

    return chapter
  }
}
