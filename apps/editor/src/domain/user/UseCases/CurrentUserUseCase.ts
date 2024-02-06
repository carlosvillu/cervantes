import {type CacheConfig, Cache} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {User} from '../Models/User.ts'
import {HTTPUserRepository} from '../Repositories/HTTPUserRepository.js'
import type {UserRepository} from '../Repositories/UserRepository.js'

export class CurrentUserUseCase implements UseCase<void, User> {
  static create({config}: {config: Config}) {
    return new CurrentUserUseCase(HTTPUserRepository.create(config))
  }

  constructor(private readonly repository: UserRepository) {}

  @Cache({
    name: 'CurrentUserUseCase',
    ttl: Number.MAX_SAFE_INTEGER,
    references: (_args, _key, result) => {
      return ['user:' + result.id]
    }
  } as const as CacheConfig<User>)
  async execute(): Promise<User> {
    return this.repository.current()
  }
}
