import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {LocalStorageAuthRepository} from '../Repositories/LocalStorageAuthRepository.js'

export class LogoutAuthUseCase implements UseCase<void, AuthTokens> {
  static create({config}: {config: Config}) {
    return new LogoutAuthUseCase(config, LocalStorageAuthRepository.create(config))
  }

  constructor(private readonly config: Config, private readonly repository: AuthRepository) {}

  async execute(): Promise<AuthTokens> {
    const authTokens = await this.repository.logout()

    return authTokens
  }
}
