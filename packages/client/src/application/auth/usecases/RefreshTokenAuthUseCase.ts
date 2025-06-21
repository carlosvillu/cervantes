/**
 * RefreshTokenAuthUseCase - Business logic for token refresh
 *
 * This use case handles refreshing access tokens using refresh tokens,
 * including validation and automatic token management.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {AuthRepository} from '../../../domain/auth/AuthRepository.js'
import type {AuthTokens} from '../../../domain/auth/AuthTokens.js'
import {RefreshRequest} from '../../../domain/auth/RefreshRequest.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface RefreshTokenAuthUseCaseInput {
  refreshToken: string
}

export type RefreshTokenAuthUseCaseOutput = AuthTokens

export class RefreshTokenAuthUseCase implements UseCase<RefreshTokenAuthUseCaseInput, RefreshTokenAuthUseCaseOutput> {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(input: RefreshTokenAuthUseCaseInput): Promise<RefreshTokenAuthUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create RefreshRequest domain object
    const refreshRequest = RefreshRequest.create(input.refreshToken)

    // Validate the created refresh request
    const validation = refreshRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid refresh token data: ${validation.errors.join(', ')}`)
    }

    // Check if refresh token is expired before attempting refresh
    if (refreshRequest.isExpired()) {
      throw new ValidationError('Refresh token has expired')
    }

    // Execute token refresh through repository
    try {
      const newTokens = await this.authRepository.refresh(refreshRequest)

      // Validate new tokens before returning
      if (!newTokens.isValid()) {
        throw new ValidationError('Invalid tokens received from server during refresh')
      }

      return newTokens
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Token refresh failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: RefreshTokenAuthUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.refreshToken?.trim()) {
      errors.push('Refresh token is required')
    }

    // Validate token format (should be a JWT-like string)
    if (input.refreshToken && !this.isValidTokenFormat(input.refreshToken)) {
      errors.push('Refresh token must be a valid JWT format')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid refresh token input: ${errors.join(', ')}`)
    }
  }

  private isValidTokenFormat(token: string): boolean {
    // Basic JWT format validation (3 parts separated by dots)
    const parts = token.split('.')
    return parts.length === 3 && parts.every(part => part.length > 0)
  }
}
