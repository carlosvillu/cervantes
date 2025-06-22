/**
 * UpdateBookUseCase - Business logic for book updates
 *
 * This use case handles the complete book update flow including validation,
 * data preparation, and interaction with the book repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Book} from '../../../domain/book/Book.js'
import type {BookRepository} from '../../../domain/book/BookRepository.js'
import {UpdateBookRequest} from '../../../domain/book/UpdateBookRequest.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface UpdateBookUseCaseInput {
  id: string
  title: string
  summary: string
  published: boolean
  createdAt: number
}

export type UpdateBookUseCaseOutput = Book

export class UpdateBookUseCase implements UseCase<UpdateBookUseCaseInput, UpdateBookUseCaseOutput> {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(input: UpdateBookUseCaseInput): Promise<UpdateBookUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create UpdateBookRequest domain object
    const updateBookRequest = UpdateBookRequest.fromAPI({
      id: input.id,
      title: input.title,
      summary: input.summary,
      published: input.published,
      createdAt: input.createdAt
    })

    // Validate the created update request
    const validation = updateBookRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid book update data: ${validation.errors.join(', ')}`)
    }

    // Execute book update through repository
    try {
      return await this.bookRepository.update(input.id, updateBookRequest)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Book update failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: UpdateBookUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.id?.trim()) {
      errors.push('Book ID is required')
    }

    if (!input.title?.trim()) {
      errors.push('Title is required')
    }

    if (!input.summary?.trim()) {
      errors.push('Summary is required')
    }

    if (typeof input.published !== 'boolean') {
      errors.push('Published status must be a boolean')
    }

    if (typeof input.createdAt !== 'number') {
      errors.push('Created at must be a timestamp number')
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

    // Validate ID format
    if (input.id && input.id.length === 0) {
      errors.push('Book ID cannot be empty')
    }

    if (input.id && input.id.length > 100) {
      errors.push('Book ID must be 100 characters or less')
    }

    // Validate title content
    if (input.title && this.containsOnlyWhitespace(input.title)) {
      errors.push('Title cannot contain only whitespace')
    }

    // Validate summary content
    if (input.summary && this.containsOnlyWhitespace(input.summary)) {
      errors.push('Summary cannot contain only whitespace')
    }

    // Validate createdAt timestamp
    if (input.createdAt && input.createdAt <= 0) {
      errors.push('Created at must be a positive timestamp')
    }

    if (input.createdAt && input.createdAt > Date.now()) {
      errors.push('Created at cannot be in the future')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid book update input: ${errors.join(', ')}`)
    }
  }

  private containsOnlyWhitespace(text: string): boolean {
    return text.trim().length === 0
  }
}
