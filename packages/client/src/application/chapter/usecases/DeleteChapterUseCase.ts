/**
 * DeleteChapterUseCase - Business logic for chapter deletion
 *
 * This use case handles chapter deletion including validation and
 * interaction with the chapter repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {ChapterRepository} from '../../../domain/chapter/ChapterRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface DeleteChapterUseCaseInput {
  id: string
}

export type DeleteChapterUseCaseOutput = undefined

export class DeleteChapterUseCase implements UseCase<DeleteChapterUseCaseInput, DeleteChapterUseCaseOutput> {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async execute(input: DeleteChapterUseCaseInput): Promise<DeleteChapterUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute chapter deletion through repository
    try {
      await this.chapterRepository.delete(input.id)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Chapter deletion failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: DeleteChapterUseCaseInput): Promise<void> {
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
      throw new ValidationError(`Invalid chapter delete input: ${errors.join(', ')}`)
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
