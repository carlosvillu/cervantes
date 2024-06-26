import {UseCase} from '../../_kernel/architecture.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import {Token} from '../Models/Token.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {RedisAuthRepository} from '../Repositories/RedisAuthRepository/index.js'

export interface VerifyRefreshTokenAuthUseCaseInput {
  refresh: string
}

export class VerifyRefreshTokenAuthUseCase implements UseCase<VerifyRefreshTokenAuthUseCaseInput, AuthTokens> {
  static create() {
    return new VerifyRefreshTokenAuthUseCase(RedisAuthRepository.create())
  }

  constructor(private readonly repository: AuthRepository) {}

  async execute({refresh}: VerifyRefreshTokenAuthUseCaseInput): Promise<AuthTokens> {
    return this.repository.verifyRefreshToken(Token.create({value: refresh}))
  }
}
