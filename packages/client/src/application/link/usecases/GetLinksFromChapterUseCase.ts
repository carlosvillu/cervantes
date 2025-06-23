/**
 * GetLinksFromChapterUseCase - Business logic for getting links from a chapter
 *
 * This use case handles retrieving all links originating from a specific chapter
 * including validation and interaction with the link repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Link} from '../../../domain/link/Link.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface GetLinksFromChapterUseCaseInput {
  fromChapterID: string
}

export type GetLinksFromChapterUseCaseOutput = Link[]

export class GetLinksFromChapterUseCase implements UseCase<GetLinksFromChapterUseCaseInput, GetLinksFromChapterUseCaseOutput> {
  constructor(private readonly linkRepository: LinkRepository) {}

  async execute(input: GetLinksFromChapterUseCaseInput): Promise<GetLinksFromChapterUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute links lookup through repository
    try {
      return await this.linkRepository.getLinksFromChapter(input.fromChapterID)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Links lookup failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: GetLinksFromChapterUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.fromChapterID?.trim()) {
      errors.push('From chapter ID is required')
    }

    // Validate ID format
    if (input.fromChapterID && input.fromChapterID.trim().length === 0) {
      errors.push('From chapter ID cannot be empty')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid links lookup input: ${errors.join(', ')}`)
    }
  }
}