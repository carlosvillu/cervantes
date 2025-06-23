/**
 * UpdateChapterUseCase - Business logic for chapter updates
 *
 * This use case handles the complete chapter update flow including validation,
 * data preparation, and interaction with the chapter repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Chapter} from '../../../domain/chapter/Chapter.js'
import type {ChapterRepository} from '../../../domain/chapter/ChapterRepository.js'
import {UpdateChapterRequest} from '../../../domain/chapter/UpdateChapterRequest.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface UpdateChapterUseCaseInput {
  id: string
  title: string
  summary: string
  bookID: string
  createdAt: string | number
}

export type UpdateChapterUseCaseOutput = Chapter

export class UpdateChapterUseCase implements UseCase<UpdateChapterUseCaseInput, UpdateChapterUseCaseOutput> {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async execute(input: UpdateChapterUseCaseInput): Promise<UpdateChapterUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create UpdateChapterRequest domain object
    const updateChapterRequest = UpdateChapterRequest.fromAPI({
      id: input.id,
      title: input.title,
      summary: input.summary,
      bookID: input.bookID,
      createdAt: input.createdAt
    })

    // Validate the update chapter request
    const validation = updateChapterRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid chapter data: ${validation.errors.join(', ')}`)
    }

    // Execute chapter update through repository
    try {
      return await this.chapterRepository.update(input.id, updateChapterRequest)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Chapter update failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: UpdateChapterUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.id?.trim()) {
      errors.push('Chapter ID is required')
    }

    if (!input.title?.trim()) {
      errors.push('Title is required')
    }

    if (!input.summary?.trim()) {
      errors.push('Summary is required')
    }

    if (!input.bookID?.trim()) {
      errors.push('Book ID is required')
    }

    if (!input.createdAt) {
      errors.push('Created at is required')
    }

    // Validate field lengths
    if (input.title && input.title.length > 200) {
      errors.push('Title must be 200 characters or less')
    }

    if (input.title && input.title.length < 1) {
      errors.push('Title must be at least 1 character long')
    }

    if (input.summary && input.summary.length > 1000) {
      errors.push('Summary must be 1000 characters or less')
    }

    if (input.summary && input.summary.length < 1) {
      errors.push('Summary must be at least 1 character long')
    }

    // Validate title content
    if (input.title && this.containsOnlyWhitespace(input.title)) {
      errors.push('Title cannot contain only whitespace')
    }

    // Validate summary content
    if (input.summary && this.containsOnlyWhitespace(input.summary)) {
      errors.push('Summary cannot contain only whitespace')
    }

    // Validate ID format (basic UUID format check)
    if (input.id && !this.isValidUUID(input.id)) {
      errors.push('Chapter ID must be a valid UUID')
    }

    // Validate bookID format (basic UUID format check)
    if (input.bookID && !this.isValidUUID(input.bookID)) {
      errors.push('Book ID must be a valid UUID')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid chapter update input: ${errors.join(', ')}`)
    }
  }

  private containsOnlyWhitespace(text: string): boolean {
    return text.trim().length === 0
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
