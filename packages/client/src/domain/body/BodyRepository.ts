/**
 * BodyRepository - Domain interface for body/content operations
 *
 * This interface defines the contract that all body repositories must implement.
 * It follows the Repository pattern from Clean Architecture, abstracting the data layer
 * from the business logic.
 */

import type {Body} from './Body.js'
import type {CreateBodyRequest} from './CreateBodyRequest.js'

export interface BodyRepository {
  /**
   * Create a new body/content version
   * @param request - Body creation data
   * @returns The created body with computed hash
   * @throws ValidationError if body data is invalid
   * @throws AuthenticationError if user is not authenticated
   */
  create: (request: CreateBodyRequest) => Promise<Body>

  /**
   * Find a body by its content hash
   * @param hash - Content hash identifier
   * @returns The body if found
   * @throws AuthenticationError if user is not authenticated
   * @throws ValidationError if hash is invalid
   * @throws NetworkError if body not found or not accessible
   */
  findByHash: (hash: string) => Promise<Body>

  /**
   * Find a body by its unique ID
   * @param id - Body identifier
   * @returns The body if found
   * @throws AuthenticationError if user is not authenticated
   * @throws ValidationError if body ID is invalid
   * @throws NetworkError if body not found or not accessible
   */
  findByID: (id: string) => Promise<Body>

  /**
   * Get all bodies for a specific chapter
   * @param bookID - Book identifier
   * @param chapterID - Chapter identifier
   * @returns Array of bodies for the chapter, sorted by creation date
   * @throws AuthenticationError if user is not authenticated
   * @throws ValidationError if book or chapter ID is invalid
   */
  getAllByChapter: (bookID: string, chapterID: string) => Promise<Body[]>
}
