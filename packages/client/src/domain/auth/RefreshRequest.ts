import { z } from 'zod'
import { ValueObject } from '../_kernel/types'
import type { components } from '../../generated/api-types'

type RefreshRequestSchema = components['schemas']['RefreshRequest']

export const RefreshRequestValidationSchema = z.object({
  refresh: z.string().min(1)
})

export class RefreshRequest extends ValueObject<RefreshRequestSchema> {
  constructor(private readonly refresh: string) {
    super({ refresh })
  }

  getRefreshToken(): string {
    return this.refresh
  }

  isValidJWT(): boolean {
    try {
      const parts = this.refresh.split('.')
      if (parts.length !== 3) return false
      
      // Try to decode the payload to validate JWT structure
      const payload = JSON.parse(atob(parts[1]))
      return typeof payload === 'object' && payload !== null
    } catch {
      return false
    }
  }

  isExpired(): boolean {
    try {
      const payload = JSON.parse(atob(this.refresh.split('.')[1]))
      const exp = payload.exp * 1000
      return Date.now() >= exp
    } catch {
      return true
    }
  }

  getExpirationTime(): number | null {
    try {
      const payload = JSON.parse(atob(this.refresh.split('.')[1]))
      return payload.exp * 1000
    } catch {
      return null
    }
  }

  getUserId(): string | null {
    try {
      const payload = JSON.parse(atob(this.refresh.split('.')[1]))
      return payload.sub || payload.userId || null
    } catch {
      return null
    }
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isValidJWT()) {
      errors.push('Refresh token must be a valid JWT')
    }

    if (this.isExpired()) {
      errors.push('Refresh token has expired')
    }

    return { isValid: errors.length === 0, errors }
  }

  static create(refreshToken: string): RefreshRequest {
    return new RefreshRequest(refreshToken)
  }

  static fromAPI(data: RefreshRequestSchema): RefreshRequest {
    const validated = RefreshRequestValidationSchema.parse(data)
    return new RefreshRequest(validated.refresh)
  }

  toAPI(): RefreshRequestSchema {
    return this.getValue()
  }
}