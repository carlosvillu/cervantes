/**
 * FindByIDBodyUseCase - Business logic for finding body by ID
 *
 * This use case handles finding a specific body by its unique identifier.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Body} from '../../../domain/body/Body.js'
import type {BodyRepository} from '../../../domain/body/BodyRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface FindByIDBodyUseCaseInput {
  id: string
}

export type FindByIDBodyUseCaseOutput = Body

export class FindByIDBodyUseCase implements UseCase<FindByIDBodyUseCaseInput, FindByIDBodyUseCaseOutput> {
  constructor(private readonly bodyRepository: BodyRepository) {}

  async execute(input: FindByIDBodyUseCaseInput): Promise<FindByIDBodyUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute body lookup through repository
    try {
      return await this.bodyRepository.findByID(input.id)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Body lookup by ID failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: FindByIDBodyUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.id?.trim()) {
      errors.push('Body ID is required')
    }

    // Validate ID format (UUID)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (input.id && !uuidPattern.test(input.id)) {
      errors.push('Body ID must be a valid UUID')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid body ID lookup input: ${errors.join(', ')}`)
    }
  }
}
