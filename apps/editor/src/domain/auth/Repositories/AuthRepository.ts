import type {ID} from '../../_kernel/ID'
import type {AuthTokens} from '../Models/AuthTokens'
import type {Email} from '../Models/Email'
import type {PlainPassword} from '../Models/PlainPassword'
import type {Token} from '../Models/Token'
import type {ValidationStatus} from '../Models/ValidationStatus'
import type {ValidationToken} from '../Models/ValidationToken'

export interface AuthRepository {
  login: (emain: Email, password: PlainPassword) => Promise<AuthTokens>
  logout: () => Promise<AuthTokens>
  save: (tokens: AuthTokens) => Promise<AuthTokens>
  validationToken: () => Promise<ValidationToken>
  checkValidationToken: (id: ID, code: Token) => Promise<ValidationStatus>
  findByIDValidationToken: (id: ID) => Promise<ValidationToken>
}
