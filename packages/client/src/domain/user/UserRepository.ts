/**
 * UserRepository - Domain interface for user operations
 *
 * This interface defines the contract that all user repositories must implement.
 * It follows the Repository pattern from Clean Architecture, abstracting the data layer
 * from the business logic.
 */

import type {User} from './User.js'

export interface UserRepository {
  /**
   * Get the current authenticated user
   * @returns The current user information
   * @throws AuthenticationError if user is not authenticated
   * @throws NetworkError if request fails
   */
  getCurrentUser: () => Promise<User>
}
