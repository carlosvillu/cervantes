import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {RedisAuthRepository} from '../Repositories/RedisAuthRepository/index.js'

export interface CreateTokenAuthUseCaseInput {
  id: string
}

export class CreateTokenAuthUseCase implements UseCase<CreateTokenAuthUseCaseInput, AuthTokens> {
  static create() {
    return new CreateTokenAuthUseCase(RedisAuthRepository.create())
  }

  constructor(private readonly repository: AuthRepository) {}

  async execute({id}: CreateTokenAuthUseCaseInput): Promise<AuthTokens> {
    return this.repository.generateTokens(ID.create({value: id}))
  }
}
