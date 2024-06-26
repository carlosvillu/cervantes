import {UseCase} from '../../_kernel/architecture.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import {Token} from '../Models/Token.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {RedisAuthRepository} from '../Repositories/RedisAuthRepository/index.js'

export interface RemoveUserTokenAuthUseCaseInput {
  refresh: string
}

export class RemoveUserTokenAuthUseCase implements UseCase<RemoveUserTokenAuthUseCaseInput, AuthTokens> {
  static create() {
    return new RemoveUserTokenAuthUseCase(RedisAuthRepository.create())
  }

  constructor(private readonly repository: AuthRepository) {}

  async execute({refresh}: RemoveUserTokenAuthUseCaseInput): Promise<AuthTokens> {
    return this.repository.removeByRefreshToken(Token.create({value: refresh}))
  }
}
