/**
 * UserService - Public user service interface
 *
 * This service provides a high-level API for all user operations.
 * It coordinates between User Use Cases and Repository implementations.
 */

import type {User} from '../../domain/user/User.js'
import type {UserRepository} from '../../domain/user/UserRepository.js'
import {type GetCurrentUserUseCaseInput, GetCurrentUserUseCase} from './usecases/index.js'

export interface UserServiceConfig {
  repository: UserRepository
}

export class UserService {
  private readonly userRepository: UserRepository

  // Use Cases
  private readonly getCurrentUserUseCase: GetCurrentUserUseCase

  constructor(config: UserServiceConfig) {
    this.userRepository = config.repository

    // Initialize Use Cases
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(this.userRepository)
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(input: GetCurrentUserUseCaseInput = {}): Promise<User> {
    return this.getCurrentUserUseCase.execute(input)
  }

  /**
   * Convenience method: Get current user without parameters
   */
  async getCurrentUserInfo(): Promise<User> {
    return this.getCurrentUser({})
  }

  /**
   * Convenience method: Check if current user is verified
   */
  async isCurrentUserVerified(): Promise<boolean> {
    const user = await this.getCurrentUser({})
    return user.isVerified()
  }

  /**
   * Convenience method: Get current user permissions
   */
  async getCurrentUserPermissions(): Promise<{
    canCreateBooks: boolean
    canPublishBooks: boolean
    canUploadImages: boolean
    canGenerateImages: boolean
  }> {
    const user = await this.getCurrentUser({})
    return {
      canCreateBooks: user.canCreateBooks(),
      canPublishBooks: user.canPublishBooks(),
      canUploadImages: user.canUploadImages(),
      canGenerateImages: user.canGenerateImages()
    }
  }

  /**
   * Convenience method: Get user profile information
   */
  async getCurrentUserProfile(): Promise<{
    id: string
    username: string
    email: string
    verified: boolean
    displayName: string
  }> {
    const user = await this.getCurrentUser({})
    return {
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail(),
      verified: user.isVerified(),
      displayName: user.getDisplayName()
    }
  }
}
