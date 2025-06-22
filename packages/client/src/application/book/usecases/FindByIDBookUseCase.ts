/**
 * FindByIDBookUseCase - Business logic for finding a book by ID
 *
 * This use case handles finding a specific book by its identifier,
 * including validation and error handling.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Book} from '../../../domain/book/Book.js'
import type {BookRepository} from '../../../domain/book/BookRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface FindByIDBookUseCaseInput {
  id: string
}

export type FindByIDBookUseCaseOutput = Book

export class FindByIDBookUseCase implements UseCase<FindByIDBookUseCaseInput, FindByIDBookUseCaseOutput> {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(input: FindByIDBookUseCaseInput): Promise<FindByIDBookUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Execute book retrieval through repository
    try {
      return await this.bookRepository.findByID(input.id)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Failed to find book: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: FindByIDBookUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.id?.trim()) {
      errors.push('Book ID is required')
    }

    // Validate ID format (basic validation)
    if (input.id && input.id.length === 0) {
      errors.push('Book ID cannot be empty')
    }

    if (input.id && this.containsOnlyWhitespace(input.id)) {
      errors.push('Book ID cannot contain only whitespace')
    }

    // Validate ID length (reasonable limits)
    if (input.id && input.id.length > 100) {
      errors.push('Book ID must be 100 characters or less')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid find book input: ${errors.join(', ')}`)
    }
  }

  private containsOnlyWhitespace(text: string): boolean {
    return text.trim().length === 0
  }
}
