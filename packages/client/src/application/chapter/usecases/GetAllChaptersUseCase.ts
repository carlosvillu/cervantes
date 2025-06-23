/**
 * GetAllChaptersUseCase - Business logic for retrieving all chapters for a book
 *
 * This use case handles chapter list retrieval by book ID including validation and
 * interaction with the chapter repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Chapter} from '../../../domain/chapter/Chapter.js'
import type {ChapterRepository} from '../../../domain/chapter/ChapterRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface GetAllChaptersUseCaseInput {
  bookId: string
}

export type GetAllChaptersUseCaseOutput = Chapter[]

export class GetAllChaptersUseCase implements UseCase<GetAllChaptersUseCaseInput, GetAllChaptersUseCaseOutput> {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async execute(input: GetAllChaptersUseCaseInput): Promise<GetAllChaptersUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute chapters retrieval through repository
    try {
      return await this.chapterRepository.getAllByBookId(input.bookId)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Chapters retrieval failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: GetAllChaptersUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.bookId?.trim()) {
      errors.push('Book ID is required')
    }

    // Validate bookId format (basic UUID format check)
    if (input.bookId && !this.isValidUUID(input.bookId)) {
      errors.push('Book ID must be a valid UUID')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid get all chapters input: ${errors.join(', ')}`)
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
