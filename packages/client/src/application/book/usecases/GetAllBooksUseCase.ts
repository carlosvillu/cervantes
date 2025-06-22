/**
 * GetAllBooksUseCase - Business logic for retrieving all user books
 *
 * This use case handles retrieving all books belonging to the authenticated user.
 * It provides a simple interface without complex filtering or pagination for now.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Book} from '../../../domain/book/Book.js'
import type {BookRepository} from '../../../domain/book/BookRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetAllBooksUseCaseInput {
  // Currently no input parameters, but keeping interface for future extensibility
  // Could add filtering, sorting, pagination in the future
}

export type GetAllBooksUseCaseOutput = Book[]

export class GetAllBooksUseCase implements UseCase<GetAllBooksUseCaseInput, GetAllBooksUseCaseOutput> {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(_input: GetAllBooksUseCaseInput): Promise<GetAllBooksUseCaseOutput> {
    // No input validation needed for this simple case
    // Future versions could validate filtering/sorting parameters

    // Execute books retrieval through repository
    try {
      const books = await this.bookRepository.getAll()

      // Apply any business logic sorting/filtering here if needed
      // For now, return books as-is from repository
      return this.sortBooksByUpdatedDate(books)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Failed to retrieve books: ${error.message}`, error)
      }
      throw error
    }
  }

  /**
   * Sort books by updated date (most recent first)
   * This provides a consistent ordering for the user
   */
  private sortBooksByUpdatedDate(books: Book[]): Book[] {
    return books.sort((a, b) => {
      const aUpdatedAt = a.getUpdatedAt()
      const bUpdatedAt = b.getUpdatedAt()

      // Sort in descending order (most recent first)
      return bUpdatedAt - aUpdatedAt
    })
  }
}
