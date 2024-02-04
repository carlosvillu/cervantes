import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Bodies} from '../Models/Bodies.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {RedisBodyRepository} from '../Repositories/RedisBodyRepository/index.js'

export interface RemoveByChapterIDBodyUseCaseInput {
  id: string
  userID: string
}

export class RemoveByChapterIDBodyUseCase implements UseCase<RemoveByChapterIDBodyUseCaseInput, Bodies> {
  static create() {
    return new RemoveByChapterIDBodyUseCase(RedisBodyRepository.create())
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({id, userID}: RemoveByChapterIDBodyUseCaseInput): Promise<Bodies> {
    return this.repository.removeByChapterID(ID.create({value: id}), ID.create({value: userID}))
  }
}
