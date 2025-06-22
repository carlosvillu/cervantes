/**
 * FindByHashBodyUseCase - Business logic for finding body by content hash
 *
 * This use case handles finding a specific body version by its content hash,
 * which is useful for content versioning and deduplication.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Body} from '../../../domain/body/Body.js'
import type {BodyRepository} from '../../../domain/body/BodyRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface FindByHashBodyUseCaseInput {
  hash: string
}

export type FindByHashBodyUseCaseOutput = Body

export class FindByHashBodyUseCase implements UseCase<FindByHashBodyUseCaseInput, FindByHashBodyUseCaseOutput> {
  constructor(private readonly bodyRepository: BodyRepository) {}

  async execute(input: FindByHashBodyUseCaseInput): Promise<FindByHashBodyUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute body lookup through repository
    try {
      return await this.bodyRepository.findByHash(input.hash)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Body lookup by hash failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: FindByHashBodyUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.hash?.trim()) {
      errors.push('Hash is required')
    }

    // Validate hash format (basic validation - should be a non-empty string)
    if (input.hash && input.hash.length < 1) {
      errors.push('Hash must be at least 1 character long')
    }

    if (input.hash && input.hash.length > 256) {
      errors.push('Hash must be 256 characters or less')
    }

    // Validate hash contains only valid characters (alphanumeric and common hash characters)
    if (input.hash && !/^[a-zA-Z0-9+/=_-]+$/.test(input.hash)) {
      errors.push('Hash contains invalid characters')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid hash lookup input: ${errors.join(', ')}`)
    }
  }
}
