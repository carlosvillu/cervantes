import {z} from 'zod'

import type {components} from '../../generated/api-types.js'
import {Entity} from '../_kernel/types.js'

type ValidationTokenSchema = components['schemas']['ValidationToken']

export const ValidationTokenValidationSchema = z.object({
  id: z.string().min(1),
  userID: z.string().min(1),
  code: z.string().optional(),
  createdAt: z.number(),
  validatedAt: z.number().nullable().optional()
})

export class ValidationToken extends Entity<string> {
  constructor(
    id: string,
    private readonly userID: string,
    private readonly code: string | undefined,
    private readonly createdAt: number,
    private readonly validatedAt: number | null | undefined
  ) {
    super(id)
  }

  getUserID(): string {
    return this.userID
  }

  getCode(): string | undefined {
    return this.code
  }

  getCreatedAt(): number {
    return this.createdAt
  }

  getValidatedAt(): number | null | undefined {
    return this.validatedAt
  }

  isValidated(): boolean {
    return this.validatedAt !== null && this.validatedAt !== undefined
  }

  isExpired(): boolean {
    const EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours
    return Date.now() > this.createdAt + EXPIRATION_TIME
  }

  canBeValidated(): boolean {
    return !this.isValidated() && !this.isExpired()
  }

  belongsToUser(userID: string): boolean {
    return this.userID === userID
  }

  static fromAPI(data: ValidationTokenSchema): ValidationToken {
    const validated = ValidationTokenValidationSchema.parse(data)
    return new ValidationToken(
      validated.id,
      validated.userID,
      validated.code,
      validated.createdAt,
      validated.validatedAt
    )
  }

  toAPI(): ValidationTokenSchema {
    return {
      id: this.getId(),
      userID: this.userID,
      code: this.code,
      createdAt: this.createdAt,
      validatedAt: this.validatedAt
    }
  }
}
