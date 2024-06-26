import {z} from 'zod'

import {Config} from '../../_config'
import type {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {DomainError} from '../../_kernel/DomainError'
import {ErrorCodes} from '../../_kernel/ErrorCodes'
import {ID} from '../../_kernel/ID'
import {Email} from '../Models/Email'
import {PlainPassword} from '../Models/PlainPassword'
import {User} from '../Models/User'
import {Username} from '../Models/Username'
import {VerifiedStatus} from '../Models/VerifiedStatus'
import type {UserRepository} from './UserRepository'

const CreateResponseSchema = z.object({
  error: z.boolean({required_error: 'Error required'}),
  message: z.string({required_error: 'Message required'})
})
type CreateResponseType = z.infer<typeof CreateResponseSchema>

const CurrentResponseSchema = z.object({
  email: z.string({required_error: 'Email required'}),
  username: z.string({required_error: 'Username required'}),
  id: z.string({required_error: 'ID required'}),
  verified: z.boolean({required_error: 'verified required'})
})
type CurrentResponseType = z.infer<typeof CurrentResponseSchema>

export class HTTPUserRepository implements UserRepository {
  static create(config: Config) {
    return new HTTPUserRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async create(id: ID, username: Username, email: Email, password: PlainPassword): Promise<User> {
    const user = User.create({id, username, email, password, verified: VerifiedStatus.failed()})

    const [error, response] = await this.fetcher.post<CreateResponseType>(
      this.config.get('API_HOST') + '/auth/signup',
      {body: user.toJSON()},
      CreateResponseSchema
    )

    if (error || response.error) return User.empty()

    return user
  }

  async current(): Promise<User | DomainError> {
    const [error, response] = await this.fetcher.get<CurrentResponseType>(
      this.config.get('API_HOST') + '/user/current',
      {},
      CurrentResponseSchema
    )

    const errorJSON = (await error?.json()) ?? {}

    if (error?.status === 401 && errorJSON.message === '401 User not verified') {
      return DomainError.create(
        [new Error(ErrorCodes.USER_LOGIN_NOT_VERIFIED)],
        '[HTTPUserRepository#current] Unauth user'
      )
    }

    if (error) return User.empty()

    return User.create({
      email: Email.create({value: response.email}),
      username: Username.create({value: response.username}),
      id: ID.create({value: response.id}),
      password: PlainPassword.create({value: '[REDACTED]'}),
      ...(response.verified && {verified: VerifiedStatus.create({value: response.verified})})
    })
  }
}
