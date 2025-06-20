/**
 * SendValidationCodeAuthUseCase - Business logic for sending email validation codes
 *
 * This use case handles sending validation codes to authenticated users
 * for email verification purposes.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {AuthRepository} from '../../../domain/auth/AuthRepository.js'
import type {ValidationToken} from '../../../domain/auth/ValidationToken.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SendValidationCodeAuthUseCaseInput {
  // No input required - uses authenticated user context
}

export type SendValidationCodeAuthUseCaseOutput = ValidationToken

export class SendValidationCodeAuthUseCase
  implements UseCase<SendValidationCodeAuthUseCaseInput, SendValidationCodeAuthUseCaseOutput>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(_input: SendValidationCodeAuthUseCaseInput): Promise<SendValidationCodeAuthUseCaseOutput> {
    // Note: This endpoint requires authentication and operates on the current authenticated user
    // The authentication is handled by the HTTPClient and AuthInterceptor

    try {
      const validationToken = await this.authRepository.sendValidationCode()

      // Validation token from server should be valid
      // If there are any issues, they'll be caught by the repository layer

      return validationToken
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Failed to send validation code: ${error.message}`, error)
      }
      throw error
    }
  }
}
