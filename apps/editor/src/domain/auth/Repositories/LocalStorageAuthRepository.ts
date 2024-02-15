import {AuthTokens} from '../Models/AuthTokens'
import {ValidationToken} from '../Models/ValidationToken'
import type {AuthRepository} from './AuthRepository'

export class LocalStorageAuthRepository implements AuthRepository {
  static __CREDENTIALS__ = 'AUTH_CREDENTIALS'
  static create() {
    return new LocalStorageAuthRepository()
  }

  async validationToken(): Promise<ValidationToken> {
    return ValidationToken.empty()
  }

  async logout(): Promise<AuthTokens> {
    window.localStorage.removeItem(LocalStorageAuthRepository.__CREDENTIALS__)

    return AuthTokens.empty()
  }

  async login(): Promise<AuthTokens> {
    return AuthTokens.empty()
  }

  async save(tokens: AuthTokens): Promise<AuthTokens> {
    window.localStorage.setItem(LocalStorageAuthRepository.__CREDENTIALS__, JSON.stringify(tokens.toJSON()))

    return tokens
  }
}
