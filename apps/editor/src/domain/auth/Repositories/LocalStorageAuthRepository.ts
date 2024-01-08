import {AuthTokens} from '../Models/AuthTokens'
import type {AuthRepository} from './AuthRepository'

export class LocalStorageAuthRepository implements AuthRepository {
  static __CREDENTIALS__ = 'AUTH_CREDENTIALS'
  static create() {
    return new LocalStorageAuthRepository()
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
