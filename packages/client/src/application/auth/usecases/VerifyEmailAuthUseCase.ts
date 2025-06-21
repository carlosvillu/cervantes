/**
 * VerifyEmailAuthUseCase - Business logic for email verification
 *
 * This use case handles verifying email addresses using validation codes
 * sent to authenticated users.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {SuccessMessage} from '../../../domain/_shared/SuccessMessage.js'
import type {AuthRepository} from '../../../domain/auth/AuthRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface VerifyEmailAuthUseCaseInput {
  validationTokenId: string
  code: string
}

export type VerifyEmailAuthUseCaseOutput = SuccessMessage

export class VerifyEmailAuthUseCase implements UseCase<VerifyEmailAuthUseCaseInput, VerifyEmailAuthUseCaseOutput> {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(input: VerifyEmailAuthUseCaseInput): Promise<VerifyEmailAuthUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    try {
      const result = await this.authRepository.verifyEmail(input.validationTokenId, input.code)

      return result
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Email verification failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: VerifyEmailAuthUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.validationTokenId?.trim()) {
      errors.push('Validation token ID is required')
    }

    if (!input.code?.trim()) {
      errors.push('Validation code is required')
    }

    // Validate validation token ID format (should be a UUID-like string)
    if (input.validationTokenId && !this.isValidUUIDFormat(input.validationTokenId)) {
      errors.push('Validation token ID must be a valid UUID format')
    }

    // Validate code format (typically a numeric or alphanumeric code)
    if (input.code && input.code.length < 4) {
      errors.push('Validation code must be at least 4 characters long')
    }

    if (input.code && input.code.length > 10) {
      errors.push('Validation code must be 10 characters or less')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid email verification input: ${errors.join(', ')}`)
    }
  }

  private isValidUUIDFormat(uuid: string): boolean {
    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
