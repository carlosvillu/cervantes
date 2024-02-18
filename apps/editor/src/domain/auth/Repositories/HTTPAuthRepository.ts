import {z} from 'zod'

import {Config} from '../../_config'
import type {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {ID} from '../../_kernel/ID'
import {TimeStamp} from '../../_kernel/TimeStamp'
import {AuthTokens} from '../Models/AuthTokens'
import {Email} from '../Models/Email'
import {PlainPassword} from '../Models/PlainPassword'
import {Token} from '../Models/Token'
import {ValidationStatus} from '../Models/ValidationStatus'
import {ValidationToken} from '../Models/ValidationToken'
import type {AuthRepository} from './AuthRepository'

const LoginResponseSchema = z.object({
  access: z.string({required_error: 'Access required'}),
  refresh: z.string({required_error: 'Refresh required'})
})
type LoginResponseType = z.infer<typeof LoginResponseSchema>

const ValidationTokenResponseSchema = z.object({
  id: z.string({required_error: 'id required'}),
  userID: z.string({required_error: 'userID required'}),
  token: z.string({required_error: 'token required'}),
  createdAt: z.number({required_error: 'createdAt required'})
})
type ValidationTokenResponseType = z.infer<typeof ValidationTokenResponseSchema>

const CheckValidationTokenResponseSchema = z.object({
  value: z.boolean({required_error: 'value is required'})
})
type CheckValidationTokenResponseType = z.infer<typeof ValidationTokenResponseSchema>

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

  async validationToken(): Promise<ValidationToken> {
    const [error, response] = await this.fetcher.post<ValidationTokenResponseType>(
      this.config.get('API_HOST') + '/auth/validationToken',
      {body: {}},
      ValidationTokenResponseSchema
    )

    if (error) return ValidationToken.empty()

    return ValidationToken.create({
      id: ID.create({value: response.id}),
      userID: ID.create({value: response.userID}),
      token: Token.create({value: response.token}),
      createdAt: TimeStamp.create({value: response.createdAt})
    })
  }

  async findByIDValidationToken(id: ID): Promise<ValidationToken> {
    const [error, response] = await this.fetcher.get<ValidationTokenResponseType>(
      this.config.get('API_HOST') + `/auth/validationToken/${id.value as string}`,
      {},
      ValidationTokenResponseSchema
    )

    if (error) return ValidationToken.empty()

    return ValidationToken.create({
      id: ID.create({value: response.id}),
      userID: ID.create({value: response.userID}),
      token: Token.create({value: response.token}),
      createdAt: TimeStamp.create({value: response.createdAt})
    })
  }

  async checkValidationToken(id: ID, code: Token): Promise<ValidationStatus> {
    const [error] = await this.fetcher.post<CheckValidationTokenResponseType>(
      this.config.get('API_HOST') + '/auth/validationToken/' + id.value + '?code=' + code.value,
      {body: {}},
      CheckValidationTokenResponseSchema
    )

    if (error) return ValidationStatus.failed()

    return ValidationStatus.success()
  }
}
