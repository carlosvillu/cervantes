/**
 * BookRepository - Domain interface for book operations
 *
 * This interface defines the contract that all book repositories must implement.
 * It follows the Repository pattern from Clean Architecture, abstracting the data layer
 * from the business logic.
 */

import type {Book} from './Book.js'
import type {CreateBookRequest} from './CreateBookRequest.js'
import type {UpdateBookRequest} from './UpdateBookRequest.js'

export interface BookRepository {
  /**
   * Create a new book
   * @param request - Book creation data
   * @returns The created book
   * @throws ValidationError if book data is invalid
   * @throws AuthenticationError if user is not authenticated
   */
  create: (request: CreateBookRequest) => Promise<Book>

  /**
   * Find a book by its ID
   * @param id - Book identifier
   * @returns The book if found
   * @throws AuthenticationError if user is not authenticated
   * @throws ValidationError if book ID is invalid
   * @throws NetworkError if book not found or not accessible
   */
  findByID: (id: string) => Promise<Book>

  /**
   * Get all books belonging to the authenticated user
   * @returns Array of user's books
   * @throws AuthenticationError if user is not authenticated
   */
  getAll: () => Promise<Book[]>

  /**
   * Update an existing book
   * @param id - Book identifier
   * @param request - Book update data
   * @returns The updated book
   * @throws ValidationError if book data is invalid
   * @throws AuthenticationError if user is not authenticated
   * @throws NetworkError if book not found or not accessible
   */
  update: (id: string, request: UpdateBookRequest) => Promise<Book>
}
