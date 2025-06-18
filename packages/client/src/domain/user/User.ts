import {z} from 'zod'

import type {components} from '../../generated/api-types.js'
import {Entity} from '../_kernel/types.js'
import {ValidationUtils} from '../_shared/validation-utils.js'

type UserSchema = components['schemas']['User']

export const UserValidationSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string(), // Always "[REDACTED]" in responses
  verified: z.boolean()
})

export class User extends Entity<string> {
  constructor(
    id: string,
    private readonly username: string,
    private readonly email: string,
    private readonly password: string,
    private readonly verified: boolean
  ) {
    super(id)
  }

  getUsername(): string {
    return this.username
  }

  getEmail(): string {
    return this.email
  }

  isVerified(): boolean {
    return this.verified
  }

  getDisplayName(): string {
    return this.username
  }

  canCreateBooks(): boolean {
    return this.verified
  }

  canPublishBooks(): boolean {
    return this.verified && this.hasValidProfile()
  }

  canUploadImages(): boolean {
    return this.verified
  }

  canGenerateImages(): boolean {
    return this.verified
  }

  hasValidProfile(): boolean {
    return this.username.length > 0 && this.email.length > 0
  }

  isEmailValid(): boolean {
    return ValidationUtils.isValidEmail(this.email)
  }

  isUsernameValid(): boolean {
    return ValidationUtils.isValidUsername(this.username)
  }

  needsEmailVerification(): boolean {
    return !this.verified && this.isEmailValid()
  }

  canPerformAction(action: UserAction): boolean {
    switch (action) {
      case 'CREATE_BOOK':
        return this.canCreateBooks()
      case 'PUBLISH_BOOK':
        return this.canPublishBooks()
      case 'UPLOAD_IMAGE':
        return this.canUploadImages()
      case 'GENERATE_IMAGE':
        return this.canGenerateImages()
      case 'UPDATE_PROFILE':
        return true // All users can update their profile
      default:
        return false
    }
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (!this.isUsernameValid()) {
      errors.push('Username must be 3-50 characters long and contain only letters, numbers, and underscores')
    }

    if (!this.isEmailValid()) {
      errors.push('Email must be a valid email address')
    }

    return {isValid: errors.length === 0, errors}
  }

  static fromAPI(data: UserSchema): User {
    const validated = UserValidationSchema.parse(data)
    return new User(validated.id, validated.username, validated.email, validated.password, validated.verified)
  }

  toAPI(): UserSchema {
    return {
      id: this.getId(),
      username: this.username,
      email: this.email,
      password: this.password, // Will be "[REDACTED]" from API
      verified: this.verified
    }
  }
}

export type UserAction = 'CREATE_BOOK' | 'PUBLISH_BOOK' | 'UPLOAD_IMAGE' | 'GENERATE_IMAGE' | 'UPDATE_PROFILE'
