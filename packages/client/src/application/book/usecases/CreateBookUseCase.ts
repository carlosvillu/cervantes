/**
 * CreateBookUseCase - Business logic for book creation
 *
 * This use case handles the complete book creation flow including validation,
 * data preparation, and interaction with the book repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Book} from '../../../domain/book/Book.js'
import type {BookRepository} from '../../../domain/book/BookRepository.js'
import {CreateBookRequest} from '../../../domain/book/CreateBookRequest.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface CreateBookUseCaseInput {
  title: string
  summary: string
  id?: string
}

export type CreateBookUseCaseOutput = Book

export class CreateBookUseCase implements UseCase<CreateBookUseCaseInput, CreateBookUseCaseOutput> {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(input: CreateBookUseCaseInput): Promise<CreateBookUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create CreateBookRequest domain object
    const createBookRequest = input.id
      ? CreateBookRequest.fromAPI({
          id: input.id,
          title: input.title,
          summary: input.summary
        })
      : CreateBookRequest.create({
          title: input.title,
          summary: input.summary
        })

    // Validate the created book request
    const validation = createBookRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid book data: ${validation.errors.join(', ')}`)
    }

    // Execute book creation through repository
    try {
      return await this.bookRepository.create(createBookRequest)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Book creation failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: CreateBookUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.title?.trim()) {
      errors.push('Title is required')
    }

    if (!input.summary?.trim()) {
      errors.push('Summary is required')
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

    if (errors.length > 0) {
      throw new ValidationError(`Invalid book creation input: ${errors.join(', ')}`)
    }
  }

  private containsOnlyWhitespace(text: string): boolean {
    return text.trim().length === 0
  }
}
