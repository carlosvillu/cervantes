import {z} from 'zod'

import {Config} from '../../_config'
import type {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {AuthTokens} from '../Models/AuthTokens'
import {Email} from '../Models/Email'
import {PlainPassword} from '../Models/PlainPassword'
import type {AuthRepository} from './AuthRepository'

const LoginResponseSchema = z.object({
  access: z.string({required_error: 'Access required'}),
  refresh: z.string({required_error: 'Refresh required'})
})
type LoginResponseType = z.infer<typeof LoginResponseSchema>

export class HTTPAuthRepository implements AuthRepository {
  static create(config: Config) {
    return new HTTPAuthRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async save(tokens: AuthTokens): Promise<AuthTokens> {
    return tokens
  }

  async logout(): Promise<AuthTokens> {
    return AuthTokens.empty()
  }

  async login(email: Email, password: PlainPassword): Promise<AuthTokens> {
    const [error, response] = await this.fetcher.post<LoginResponseType>(
      this.config.get('API_HOST') + '/auth/login',
      {body: {email: email.value, password: password.value}},
      LoginResponseSchema
    )

    if (error) return AuthTokens.empty()

    return AuthTokens.create(response)
  }
}
