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

  // Caching
  private cachedUser?: {user: User; timestamp: number}
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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
   * Get cached user if available and not expired, otherwise fetch fresh
   * @private
   */
  private async getCachedUser(): Promise<User> {
    if (this.cachedUser && Date.now() - this.cachedUser.timestamp < this.CACHE_TTL) {
      return this.cachedUser.user
    }
    const user = await this.getCurrentUser({})
    this.cachedUser = {user, timestamp: Date.now()}
    return user
  }

  /**
   * Clear cached user data
   */
  clearUserCache(): void {
    this.cachedUser = undefined
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
    const user = await this.getCachedUser()
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
    const user = await this.getCachedUser()
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
    const user = await this.getCachedUser()
    return {
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail(),
      verified: user.isVerified(),
      displayName: user.getDisplayName()
    }
  }

  /**
   * Batch method: Get user info, permissions, and profile in one call
   * This method uses caching to avoid multiple API calls
   */
  async getUserInfo(): Promise<{
    user: User
    permissions: {
      canCreateBooks: boolean
      canPublishBooks: boolean
      canUploadImages: boolean
      canGenerateImages: boolean
    }
    profile: {
      id: string
      username: string
      email: string
      verified: boolean
      displayName: string
    }
  }> {
    const user = await this.getCachedUser()
    return {
      user,
      permissions: {
        canCreateBooks: user.canCreateBooks(),
        canPublishBooks: user.canPublishBooks(),
        canUploadImages: user.canUploadImages(),
        canGenerateImages: user.canGenerateImages()
      },
      profile: {
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail(),
        verified: user.isVerified(),
        displayName: user.getDisplayName()
      }
    }
  }
}
