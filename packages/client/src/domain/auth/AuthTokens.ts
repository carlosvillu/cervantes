import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {ValueObject} from '../_kernel/types'

type AuthTokensSchema = components['schemas']['AuthTokens']

export const AuthTokensValidationSchema = z.object({
  access: z.string().min(1),
  refresh: z.string().min(1)
})

export class AuthTokens extends ValueObject<AuthTokensSchema> {
  constructor(private readonly access: string, private readonly refresh: string) {
    super({access, refresh})
  }

  getAccessToken(): string {
    return this.access
  }

  getRefreshToken(): string {
    return this.refresh
  }

  isAccessTokenExpired(): boolean {
    try {
      const payload = JSON.parse(atob(this.access.split('.')[1]))
      const exp = payload.exp * 1000
      return Date.now() >= exp
    } catch {
      return true
    }
  }

  isRefreshTokenExpired(): boolean {
    try {
      const payload = JSON.parse(atob(this.refresh.split('.')[1]))
      const exp = payload.exp * 1000
      return Date.now() >= exp
    } catch {
      return true
    }
  }

  needsRefresh(): boolean {
    return this.isAccessTokenExpired() && !this.isRefreshTokenExpired()
  }

  isValid(): boolean {
    return !this.isAccessTokenExpired() && !this.isRefreshTokenExpired()
  }

  static fromAPI(data: AuthTokensSchema): AuthTokens {
    const validated = AuthTokensValidationSchema.parse(data)
    return new AuthTokens(validated.access, validated.refresh)
  }

  toAPI(): AuthTokensSchema {
    return this.getValue()
  }
}
