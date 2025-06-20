/**
 * LoginAuthUseCase - Business logic for user authentication
 *
 * This use case handles the complete user login flow including validation,
 * credential verification, and token management.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {AuthRepository} from '../../../domain/auth/AuthRepository.js'
import type {AuthTokens} from '../../../domain/auth/AuthTokens.js'
import {LoginRequest} from '../../../domain/auth/LoginRequest.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface LoginAuthUseCaseInput {
  email: string
  password: string
}

export type LoginAuthUseCaseOutput = AuthTokens

export class LoginAuthUseCase implements UseCase<LoginAuthUseCaseInput, LoginAuthUseCaseOutput> {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(input: LoginAuthUseCaseInput): Promise<LoginAuthUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create LoginRequest domain object
    const loginRequest = LoginRequest.create(input.email, input.password)

    // Validate the created login request
    const validation = loginRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid login data: ${validation.errors.join(', ')}`)
    }

    // Execute login through repository
    try {
      const authTokens = await this.authRepository.login(loginRequest)

      // Validate tokens before returning
      if (!authTokens.isValid()) {
        throw new ValidationError('Invalid tokens received from server')
      }

      return authTokens
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Login failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: LoginAuthUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.email?.trim()) {
      errors.push('Email is required')
    }

    if (!input.password?.trim()) {
      errors.push('Password is required')
    }

    // Validate email format
    if (input.email && !this.isValidEmail(input.email)) {
      errors.push('Email must be a valid format')
    }

    // Validate password length (basic security check)
    if (input.password && input.password.length < 1) {
      errors.push('Password cannot be empty')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid login input: ${errors.join(', ')}`)
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
