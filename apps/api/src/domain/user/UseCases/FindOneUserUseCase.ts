import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {Email} from '../Models/Email.js'
import {User} from '../Models/User.js'
import {RedisUserRepository} from '../Repository/RedisUserRepository/index.js'
import {UserRepository} from '../Repository/UserRepository.js'

export interface FindOneUserUseCaseInput {
  email: string
}

export class FindOneUserUseCase implements UseCase<FindOneUserUseCaseInput, User> {
  static create({config}: {config: Config}) {
    return new FindOneUserUseCase(config, RedisUserRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: UserRepository) {}

  async execute({email}: FindOneUserUseCaseInput): Promise<User> {
    return this.repository.findOneByEmail(Email.create({value: email}))
  }
}
