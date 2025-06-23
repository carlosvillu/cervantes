/**
 * GetAllBodiesUseCase - Business logic for retrieving all bodies for a chapter
 *
 * This use case handles retrieving all content versions for a specific chapter,
 * which is useful for content history and version management.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Body} from '../../../domain/body/Body.js'
import type {BodyRepository} from '../../../domain/body/BodyRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface GetAllBodiesUseCaseInput {
  bookID: string
  chapterID: string
}

export type GetAllBodiesUseCaseOutput = Body[]

export class GetAllBodiesUseCase implements UseCase<GetAllBodiesUseCaseInput, GetAllBodiesUseCaseOutput> {
  constructor(private readonly bodyRepository: BodyRepository) {}

  async execute(input: GetAllBodiesUseCaseInput): Promise<GetAllBodiesUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute bodies retrieval through repository
    try {
      return await this.bodyRepository.getAllByChapter(input.bookID, input.chapterID)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Bodies retrieval failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: GetAllBodiesUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.bookID?.trim()) {
      errors.push('Book ID is required')
    }

    if (!input.chapterID?.trim()) {
      errors.push('Chapter ID is required')
    }

    // Validate ID format (UUID)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (input.bookID && !uuidPattern.test(input.bookID)) {
      errors.push('Book ID must be a valid UUID')
    }

    if (input.chapterID && !uuidPattern.test(input.chapterID)) {
      errors.push('Chapter ID must be a valid UUID')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid bodies retrieval input: ${errors.join(', ')}`)
    }
  }
}
