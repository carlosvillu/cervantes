import {InvalidateCache, InvalidateCacheConfig} from '@cervantes/decorators'

import {UseCase} from '../../_kernel/architecture.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {LocalStorageAuthRepository} from '../Repositories/LocalStorageAuthRepository.js'

export class LogoutAuthUseCase implements UseCase<void, AuthTokens> {
  static create() {
    return new LogoutAuthUseCase(LocalStorageAuthRepository.create())
  }

  constructor(private readonly repository: AuthRepository) {}

  @InvalidateCache({references: () => ['user:*']} as const as InvalidateCacheConfig<AuthTokens>)
  async execute(): Promise<AuthTokens> {
    const authTokens = await this.repository.logout()

    return authTokens
  }
}
