/**
 * LogoutAuthUseCase - Business logic for user logout
 *
 * This use case handles the complete logout flow including token invalidation,
 * cleanup of local authentication state, and proper error handling.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {SuccessMessage} from '../../../domain/_shared/SuccessMessage.js'
import type {AuthRepository} from '../../../domain/auth/AuthRepository.js'
import {RefreshRequest} from '../../../domain/auth/RefreshRequest.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface LogoutAuthUseCaseInput {
  refreshToken: string
}

export type LogoutAuthUseCaseOutput = SuccessMessage

export class LogoutAuthUseCase implements UseCase<LogoutAuthUseCaseInput, LogoutAuthUseCaseOutput> {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(input: LogoutAuthUseCaseInput): Promise<LogoutAuthUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create RefreshRequest domain object for logout
    const refreshRequest = RefreshRequest.create(input.refreshToken)

    // Validate the refresh request
    const validation = refreshRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid refresh token for logout: ${validation.errors.join(', ')}`)
    }

    // Execute logout through repository
    try {
      const result = await this.authRepository.logout(refreshRequest)

      // Note: The HTTPAuthRepository already handles clearing tokens in the HTTP client
      // but this use case could also handle additional cleanup if needed

      return result
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Logout failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: LogoutAuthUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.refreshToken?.trim()) {
      errors.push('Refresh token is required for logout')
    }

    // Validate token format (should be a JWT-like string)
    if (input.refreshToken && !this.isValidTokenFormat(input.refreshToken)) {
      errors.push('Refresh token must be a valid JWT format')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid logout input: ${errors.join(', ')}`)
    }
  }

  private isValidTokenFormat(token: string): boolean {
    // Basic JWT format validation (3 parts separated by dots)
    const parts = token.split('.')
    return parts.length === 3 && parts.every(part => part.length > 0)
  }
}
