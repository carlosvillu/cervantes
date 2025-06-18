import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {ValueObject} from '../_kernel/types'

type LoginRequestSchema = components['schemas']['LoginRequest']

export const LoginRequestValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export class LoginRequest extends ValueObject<LoginRequestSchema> {
  constructor(private readonly email: string, private readonly password: string) {
    super({email, password})
  }

  getEmail(): string {
    return this.email
  }

  getPassword(): string {
    return this.password
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(this.email)
  }

  hasPassword(): boolean {
    return this.password.length > 0
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (!this.isValidEmail()) {
      errors.push('Email must be a valid email address')
    }

    if (!this.hasPassword()) {
      errors.push('Password is required')
    }

    return {isValid: errors.length === 0, errors}
  }

  static create(email: string, password: string): LoginRequest {
    return new LoginRequest(email, password)
  }

  static fromAPI(data: LoginRequestSchema): LoginRequest {
    const validated = LoginRequestValidationSchema.parse(data)
    return new LoginRequest(validated.email, validated.password)
  }

  toAPI(): LoginRequestSchema {
    return this.getValue()
  }
}
