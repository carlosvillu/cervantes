import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../Models/ID.js'
import {User} from '../Models/User.js'
import {RedisUserRepository} from '../Repository/RedisUserRepository/index.js'
import {UserRepository} from '../Repository/UserRepository.js'

export interface FindByIDUserUseCaseInput {
  id: string
}

export class FindByIDUserUseCase implements UseCase<FindByIDUserUseCaseInput, User> {
  static create({config}: {config: Config}) {
    return new FindByIDUserUseCase(config, RedisUserRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: UserRepository) {}

  async execute({id}: FindByIDUserUseCaseInput): Promise<User> {
    return this.repository.findByID(ID.create({value: id}))
  }
}
