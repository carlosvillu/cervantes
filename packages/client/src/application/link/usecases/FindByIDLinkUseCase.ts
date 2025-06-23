/**
 * FindByIDLinkUseCase - Business logic for finding link by ID
 *
 * This use case handles finding a specific link by its ID including validation
 * and interaction with the link repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Link} from '../../../domain/link/Link.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface FindByIDLinkUseCaseInput {
  id: string
}

export type FindByIDLinkUseCaseOutput = Link | null

export class FindByIDLinkUseCase implements UseCase<FindByIDLinkUseCaseInput, FindByIDLinkUseCaseOutput> {
  constructor(private readonly linkRepository: LinkRepository) {}

  async execute(input: FindByIDLinkUseCaseInput): Promise<FindByIDLinkUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute link lookup through repository
    try {
      return await this.linkRepository.findByID(input.id)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Link lookup failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: FindByIDLinkUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.id?.trim()) {
      errors.push('Link ID is required')
    }

    // Validate ID format
    if (input.id && input.id.trim().length === 0) {
      errors.push('Link ID cannot be empty')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid link lookup input: ${errors.join(', ')}`)
    }
  }
}
