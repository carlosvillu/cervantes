import {z} from 'zod'

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
    return new LoginAuthUseCase(config, HTTPAuthRepository.create(config), LocalStorageAuthRepository.create(config))
  }

  constructor(
    private readonly config: Config,
    private readonly remoteRepository: AuthRepository,
    private readonly localRepository: AuthRepository
  ) {}

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
