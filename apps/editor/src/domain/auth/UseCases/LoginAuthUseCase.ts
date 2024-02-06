import {z} from 'zod'

import {InvalidateCache, InvalidateCacheConfig} from '@cervantes/decorators'

import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import type {AuthTokens} from '../Models/AuthTokens.js'
import {Email} from '../Models/Email.js'
import {PlainPassword} from '../Models/PlainPassword.js'
import type {AuthRepository} from '../Repositories/AuthRepository.js'
import {HTTPAuthRepository} from '../Repositories/HTTPAuthRepository.js'
import {LocalStorageAuthRepository} from '../Repositories/LocalStorageAuthRepository.js'

const LoginAuthUseCaseValidations = z.object({
  email: z.string({required_error: 'Email required'}),
  password: z.string({required_error: 'Password required'})
})

export type LoginAuthUseCaseInput = z.infer<typeof LoginAuthUseCaseValidations>

export class LoginAuthUseCase implements UseCase<LoginAuthUseCaseInput, AuthTokens> {
  static create({config}: {config: Config}) {
    return new LoginAuthUseCase(HTTPAuthRepository.create(config), LocalStorageAuthRepository.create())
  }

  constructor(private readonly remoteRepository: AuthRepository, private readonly localRepository: AuthRepository) {}

  @InvalidateCache({references: () => ['user:*']} as const as InvalidateCacheConfig<AuthTokens>)
  async execute({email, password}: LoginAuthUseCaseInput): Promise<AuthTokens> {
    LoginAuthUseCaseValidations.parse({email, password})

    const authTokens = await this.remoteRepository.login(
      Email.create({value: email}),
      PlainPassword.create({value: password})
    )

    if (authTokens.isEmpty()) return authTokens

    await this.localRepository.save(authTokens)

    return authTokens
  }
}
