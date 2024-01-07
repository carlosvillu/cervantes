import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {User} from '../Models/User.ts'
import {HTTPUserRepository} from '../Repositories/HTTPUserRepository.js'
import type {UserRepository} from '../Repositories/UserRepository.js'

export class CurrentUserUseCase implements UseCase<void, User> {
  static create({config}: {config: Config}) {
    return new CurrentUserUseCase(config, HTTPUserRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: UserRepository) {}

  async execute(): Promise<User> {
    return this.repository.current()
  }
}
