import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ValidationToken} from '../Models/ValidationToken.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {HTTPAuthRepository} from '../Repositories/HTTPAuthRepository.js'

export class CreateValidationTokenAuthUseCase implements UseCase<void, ValidationToken> {
  static create({config}: {config: Config}) {
    return new CreateValidationTokenAuthUseCase(HTTPAuthRepository.create(config))
  }

  constructor(private readonly repository: AuthRepository) {}

  async execute(): Promise<ValidationToken> {
    const validationToken = await this.repository.validationToken()
    return validationToken
  }
}
