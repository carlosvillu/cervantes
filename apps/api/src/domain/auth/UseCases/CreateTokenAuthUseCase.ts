import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import {ID} from '../Models/ID.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {RedisAuthRepository} from '../Repositories/RedisAuthRepository/index.js'

export interface CreateTokenAuthUseCaseInput {
  id: string
}

export class CreateTokenAuthUseCase implements UseCase<CreateTokenAuthUseCaseInput, AuthTokens> {
  static create({config}: {config: Config}) {
    return new CreateTokenAuthUseCase(config, RedisAuthRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: AuthRepository) {}

  async execute({id}: CreateTokenAuthUseCaseInput): Promise<AuthTokens> {
    return this.repository.generateTokens(ID.create({value: id}))
  }
}
