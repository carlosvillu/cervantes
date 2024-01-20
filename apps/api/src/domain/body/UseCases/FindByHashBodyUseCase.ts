import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Body} from '../Models/Body.js'
import {Hash} from '../Models/Hash.js'
import {BodyRepository} from '../Repositories/BodyRepository.js'
import {RedisBodyRepository} from '../Repositories/RedisBodyRepository/index.js'

export interface FindByHashBodyUseCaseInput {
  hash: string
  userID: string
}

export class FindByHashBodyUseCase implements UseCase<FindByHashBodyUseCaseInput, Body> {
  static create() {
    return new FindByHashBodyUseCase(RedisBodyRepository.create())
  }

  constructor(private readonly repository: BodyRepository) {}

  async execute({hash, userID}: FindByHashBodyUseCaseInput): Promise<Body> {
    return this.repository.findByHash(Hash.fromHashedValue({value: hash}), ID.create({value: userID}))
  }
}
