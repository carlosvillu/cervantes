/**
 * SignupAuthUseCase - Business logic for user registration
 *
 * This use case handles the complete user registration flow including validation,
 * data preparation, and interaction with the auth repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {SuccessMessage} from '../../../domain/_shared/SuccessMessage.js'
import type {AuthRepository} from '../../../domain/auth/AuthRepository.js'
import {SignupRequest} from '../../../domain/auth/SignupRequest.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface SignupAuthUseCaseInput {
  username: string
  email: string
  password: string
  id?: string
}

export type SignupAuthUseCaseOutput = SuccessMessage

export class SignupAuthUseCase implements UseCase<SignupAuthUseCaseInput, SignupAuthUseCaseOutput> {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(input: SignupAuthUseCaseInput): Promise<SignupAuthUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create SignupRequest domain object
    const signupRequest = SignupRequest.create({
      username: input.username,
      password: input.password,
      email: input.email
    })

    // Validate the created signup request
    const validation = signupRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid signup data: ${validation.errors.join(', ')}`)
    }

    // Execute signup through repository
    try {
      return await this.authRepository.signup(signupRequest)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Signup failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: SignupAuthUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.username?.trim()) {
      errors.push('Username is required')
    }

    if (!input.email?.trim()) {
      errors.push('Email is required')
    }

    if (!input.password?.trim()) {
      errors.push('Password is required')
    }

    // Validate field lengths
    if (input.username && input.username.length > 50) {
      errors.push('Username must be 50 characters or less')
    }

    if (input.password && input.password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (input.password && input.password.length > 100) {
      errors.push('Password must be 100 characters or less')
    }

    // Validate email format
    if (input.email && !this.isValidEmail(input.email)) {
      errors.push('Email must be a valid format')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid signup input: ${errors.join(', ')}`)
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
