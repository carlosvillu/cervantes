import {z} from 'zod'

import type {components} from '../../generated/api-types.js'
import {ValueObject} from '../_kernel/types.js'

type SignupRequestSchema = components['schemas']['SignupRequest']

export const SignupRequestValidationSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1).max(50),
  password: z.string().min(8).max(100),
  email: z.string().email()
})

export class SignupRequest extends ValueObject<SignupRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly username: string,
    private readonly password: string,
    private readonly email: string
  ) {
    super({id, username, password, email})
  }

  getId(): string {
    return this.id
  }

  getUsername(): string {
    return this.username
  }

  getPassword(): string {
    return this.password
  }

  getEmail(): string {
    return this.email
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(this.email)
  }

  isStrongPassword(): boolean {
    const hasMinLength = this.password.length >= 8
    const hasUpperCase = /[A-Z]/.test(this.password)
    const hasLowerCase = /[a-z]/.test(this.password)
    const hasNumbers = /\d/.test(this.password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password)

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  }

  isValidUsername(): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/
    return usernameRegex.test(this.username)
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (!this.isValidUsername()) {
      errors.push('Username must be 3-50 characters long and contain only letters, numbers, and underscores')
    }

    if (!this.isValidEmail()) {
      errors.push('Email must be a valid email address')
    }

    if (!this.isStrongPassword()) {
      errors.push(
        'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
      )
    }

    return {isValid: errors.length === 0, errors}
  }

  static create(data: Omit<SignupRequestSchema, 'id'>): SignupRequest {
    const id = crypto.randomUUID()
    return SignupRequest.fromAPI({...data, id})
  }

  static fromAPI(data: SignupRequestSchema): SignupRequest {
    const validated = SignupRequestValidationSchema.parse(data)
    return new SignupRequest(validated.id, validated.username, validated.password, validated.email)
  }

  toAPI(): SignupRequestSchema {
    return this.getValue()
  }
}
