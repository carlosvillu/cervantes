/**
 * FindByIDChapterUseCase - Business logic for finding a chapter by ID
 *
 * This use case handles chapter retrieval by ID including validation and
 * interaction with the chapter repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Chapter} from '../../../domain/chapter/Chapter.js'
import type {ChapterRepository} from '../../../domain/chapter/ChapterRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface FindByIDChapterUseCaseInput {
  id: string
}

export type FindByIDChapterUseCaseOutput = Chapter

export class FindByIDChapterUseCase implements UseCase<FindByIDChapterUseCaseInput, FindByIDChapterUseCaseOutput> {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async execute(input: FindByIDChapterUseCaseInput): Promise<FindByIDChapterUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute chapter retrieval through repository
    try {
      return await this.chapterRepository.findByID(input.id)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Chapter retrieval failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: FindByIDChapterUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.id?.trim()) {
      errors.push('Chapter ID is required')
    }

    // Validate ID format (basic UUID format check)
    if (input.id && !this.isValidUUID(input.id)) {
      errors.push('Chapter ID must be a valid UUID')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid chapter find input: ${errors.join(', ')}`)
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
