/**
 * ChapterRepository - Domain interface for chapter operations
 *
 * This interface defines the contract that all chapter repositories must implement.
 * It follows the Repository pattern from Clean Architecture, abstracting the data layer
 * from the business logic.
 */

import type {Chapter} from './Chapter.js'
import type {CreateChapterRequest} from './CreateChapterRequest.js'
import type {UpdateChapterRequest} from './UpdateChapterRequest.js'

export interface ChapterRepository {
  /**
   * Create a new chapter
   * @param request - Chapter creation data
   * @returns The created chapter
   * @throws ValidationError if chapter data is invalid
   * @throws AuthenticationError if user is not authenticated
   */
  create: (request: CreateChapterRequest) => Promise<Chapter>

  /**
   * Find a chapter by its ID
   * @param id - Chapter identifier
   * @returns The chapter if found
   * @throws AuthenticationError if user is not authenticated
   * @throws ValidationError if chapter ID is invalid
   * @throws NetworkError if chapter not found or not accessible
   */
  findByID: (id: string) => Promise<Chapter>

  /**
   * Get all chapters for a specific book
   * @param bookId - Book identifier to filter chapters
   * @returns Array of chapters belonging to the book
   * @throws AuthenticationError if user is not authenticated
   * @throws ValidationError if book ID is invalid
   */
  getAllByBookId: (bookId: string) => Promise<Chapter[]>

  /**
   * Update an existing chapter
   * @param id - Chapter identifier
   * @param request - Chapter update data
   * @returns The updated chapter
   * @throws ValidationError if chapter data is invalid
   * @throws AuthenticationError if user is not authenticated
   * @throws NetworkError if chapter not found or not accessible
   */
  update: (id: string, request: UpdateChapterRequest) => Promise<Chapter>

  /**
   * Delete a chapter by its ID
   * @param id - Chapter identifier
   * @returns Promise that resolves when chapter is deleted
   * @throws AuthenticationError if user is not authenticated
   * @throws ValidationError if chapter ID is invalid
   * @throws NetworkError if chapter not found or not accessible
   */
  delete: (id: string) => Promise<void>
}
