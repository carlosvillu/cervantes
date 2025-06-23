/**
 * DeleteLinkUseCase - Business logic for link deletion
 *
 * This use case handles the complete link deletion flow including validation
 * and interaction with the link repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {SuccessMessage} from '../../../domain/_shared/SuccessMessage.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface DeleteLinkUseCaseInput {
  id: string
}

export type DeleteLinkUseCaseOutput = SuccessMessage

export class DeleteLinkUseCase implements UseCase<DeleteLinkUseCaseInput, DeleteLinkUseCaseOutput> {
  constructor(private readonly linkRepository: LinkRepository) {}

  async execute(input: DeleteLinkUseCaseInput): Promise<DeleteLinkUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute link deletion through repository
    try {
      return await this.linkRepository.delete(input.id)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Link deletion failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: DeleteLinkUseCaseInput): Promise<void> {
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
      throw new ValidationError(`Invalid link deletion input: ${errors.join(', ')}`)
    }
  }
}