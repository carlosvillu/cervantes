/**
 * GetCurrentUserUseCase - Business logic for getting current authenticated user
 *
 * This use case handles retrieving information about the currently authenticated user,
 * including validation and error handling.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {User} from '../../../domain/user/User.js'
import type {UserRepository} from '../../../domain/user/UserRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface GetCurrentUserUseCaseInput {
  // No input parameters needed for getting current user
}

export type GetCurrentUserUseCaseOutput = User

export class GetCurrentUserUseCase implements UseCase<GetCurrentUserUseCaseInput, GetCurrentUserUseCaseOutput> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetCurrentUserUseCaseInput): Promise<GetCurrentUserUseCaseOutput> {
    // Validate input data (no specific validation needed for current user)
    await this.validateInput(input)

    // Execute user retrieval through repository
    try {
      return await this.userRepository.getCurrentUser()
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Failed to get current user: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: GetCurrentUserUseCaseInput): Promise<void> {
    // Input validation is minimal for getCurrentUser as it doesn't require parameters
    // The input object is mainly for consistency with other use cases
    if (input === null || input === undefined) {
      throw new ValidationError('Input cannot be null or undefined')
    }
  }
}