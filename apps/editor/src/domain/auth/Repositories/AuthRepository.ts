import type {AuthTokens} from '../Models/AuthTokens'
import type {Email} from '../Models/Email'
import type {PlainPassword} from '../Models/PlainPassword'
import type {ValidationToken} from '../Models/ValidationToken'

export interface AuthRepository {
  login: (emain: Email, password: PlainPassword) => Promise<AuthTokens>
  logout: () => Promise<AuthTokens>
  save: (tokens: AuthTokens) => Promise<AuthTokens>
  validationToken: () => Promise<ValidationToken>
}
