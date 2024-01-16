import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {RedisBodyRepository} from '../Repositories/RedisBodyRepository/index.js'

export interface FindByIDBodyUseCaseInput {
  id: string
  userID: string
}

export class FindByIDBodyUseCase implements UseCase<FindByIDBodyUseCaseInput, Body> {
  static create() {
    return new FindByIDBodyUseCase(RedisBodyRepository.create())
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({id, userID}: FindByIDBodyUseCaseInput): Promise<Body> {
    return this.repository.findByID(ID.create({value: id}), ID.create({value: userID}))
  }
}
