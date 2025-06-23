/**
 * UserService Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {User} from '../../domain/user/User.js'
import type {UserRepository} from '../../domain/user/UserRepository.js'
import {UserService} from './UserService.js'

describe('UserService', () => {
  let mockUserRepository: UserRepository
  let userService: UserService

  beforeEach(() => {
    mockUserRepository = {
      getCurrentUser: vi.fn()
    }
    userService = new UserService({repository: mockUserRepository})
  })

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.getCurrentUser({})

      // Assert
      expect(result).toBe(mockUser)
      expect(mockUserRepository.getCurrentUser).toHaveBeenCalledOnce()
    })

    it('should handle empty input object', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.getCurrentUser()

      // Assert
      expect(result).toBe(mockUser)
    })
  })

  describe('getCurrentUserInfo', () => {
    it('should get current user info without parameters', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.getCurrentUserInfo()

      // Assert
      expect(result).toBe(mockUser)
      expect(mockUserRepository.getCurrentUser).toHaveBeenCalledOnce()
    })
  })

  describe('isCurrentUserVerified', () => {
    it('should return true for verified user', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.isCurrentUserVerified()

      // Assert
      expect(result).toBe(true)
    })

    it('should return false for unverified user', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: false
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.isCurrentUserVerified()

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getCurrentUserPermissions', () => {
    it('should return correct permissions for verified user', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.getCurrentUserPermissions()

      // Assert
      expect(result).toEqual({
        canCreateBooks: true,
        canPublishBooks: true,
        canUploadImages: true,
        canGenerateImages: true
      })
    })

    it('should return correct permissions for unverified user', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: false
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.getCurrentUserPermissions()

      // Assert
      expect(result).toEqual({
        canCreateBooks: false,
        canPublishBooks: false,
        canUploadImages: false,
        canGenerateImages: false
      })
    })
  })

  describe('getCurrentUserProfile', () => {
    it('should return user profile information', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.getCurrentUserProfile()

      // Assert
      expect(result).toEqual({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        verified: true,
        displayName: 'testuser'
      })
    })

    it('should handle user with different display name logic', async () => {
      // Arrange
      const mockUser = User.fromAPI({
        id: 'test-user-id',
        username: 'differentuser',
        email: 'different@example.com',
        password: '[REDACTED]',
        verified: false
      })

      vi.mocked(mockUserRepository.getCurrentUser).mockResolvedValue(mockUser)

      // Act
      const result = await userService.getCurrentUserProfile()

      // Assert
      expect(result).toEqual({
        id: 'test-user-id',
        username: 'differentuser',
        email: 'different@example.com',
        verified: false,
        displayName: 'differentuser'
      })
    })
  })

  describe('error handling', () => {
    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Repository failed')
      vi.mocked(mockUserRepository.getCurrentUser).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(userService.getCurrentUser({})).rejects.toThrow('Repository failed')
      await expect(userService.getCurrentUserInfo()).rejects.toThrow('Repository failed')
      await expect(userService.isCurrentUserVerified()).rejects.toThrow('Repository failed')
      await expect(userService.getCurrentUserPermissions()).rejects.toThrow('Repository failed')
      await expect(userService.getCurrentUserProfile()).rejects.toThrow('Repository failed')
    })
  })
})