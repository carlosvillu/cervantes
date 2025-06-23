/**
 * CervantesClient User Management Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {User} from '../domain/user/User.js'
import {CervantesClient} from './CervantesClient.js'

// Mock storage to avoid browser dependencies
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockStorage = {
  setItem: vi.fn(),
  getItem: vi.fn().mockReturnValue(null),
  removeItem: vi.fn()
}

// Mock fetch for HTTP requests
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('CervantesClient - User Management', () => {
  let cervantesClient: CervantesClient

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    cervantesClient = new CervantesClient({
      baseURL: 'http://test.example.com',
      debug: false
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      // Arrange
      const mockUserData = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUserData),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act
      const result = await cervantesClient.getCurrentUser({})

      // Assert
      expect(result).toBeInstanceOf(User)
      expect(result.getId()).toBe('test-user-id')
      expect(result.getUsername()).toBe('testuser')
      expect(result.getEmail()).toBe('test@example.com')
      expect(result.isVerified()).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test.example.com/user/current',
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should handle default empty input', async () => {
      // Arrange
      const mockUserData = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUserData),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act
      const result = await cervantesClient.getCurrentUser()

      // Assert
      expect(result).toBeInstanceOf(User)
      expect(mockFetch).toHaveBeenCalledOnce()
    })
  })

  describe('getCurrentUserInfo', () => {
    it('should get current user info without parameters', async () => {
      // Arrange
      const mockUserData = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUserData),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act
      const result = await cervantesClient.getCurrentUserInfo()

      // Assert
      expect(result).toBeInstanceOf(User)
      expect(result.getId()).toBe('test-user-id')
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test.example.com/user/current',
        expect.objectContaining({
          method: 'GET'
        })
      )
    })
  })

  describe('isCurrentUserVerified', () => {
    it('should return true for verified user', async () => {
      // Arrange
      const mockUserData = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUserData),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act
      const result = await cervantesClient.isCurrentUserVerified()

      // Assert
      expect(result).toBe(true)
    })

    it('should return false for unverified user', async () => {
      // Arrange
      const mockUserData = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: false
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUserData),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act
      const result = await cervantesClient.isCurrentUserVerified()

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getCurrentUserPermissions', () => {
    it('should return correct permissions for verified user', async () => {
      // Arrange
      const mockUserData = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUserData),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act
      const result = await cervantesClient.getCurrentUserPermissions()

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
      const mockUserData = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: false
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUserData),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act
      const result = await cervantesClient.getCurrentUserPermissions()

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
      const mockUserData = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        password: '[REDACTED]',
        verified: true
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUserData),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act
      const result = await cervantesClient.getCurrentUserProfile()

      // Assert
      expect(result).toEqual({
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        verified: true,
        displayName: 'testuser'
      })
    })
  })

  describe('getUserService', () => {
    it('should return UserService instance', () => {
      // Act
      const userService = cervantesClient.getUserService()

      // Assert
      expect(userService).toBeDefined()
      expect(typeof userService.getCurrentUser).toBe('function')
      expect(typeof userService.getCurrentUserInfo).toBe('function')
      expect(typeof userService.isCurrentUserVerified).toBe('function')
      expect(typeof userService.getCurrentUserPermissions).toBe('function')
      expect(typeof userService.getCurrentUserProfile).toBe('function')
    })
  })

  describe('error handling', () => {
    it('should propagate HTTP client errors', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({message: 'Unauthorized'}),
        clone: vi.fn().mockReturnThis()
      } as any)

      // Act & Assert
      await expect(cervantesClient.getCurrentUser()).rejects.toThrow()
      await expect(cervantesClient.getCurrentUserInfo()).rejects.toThrow()
      await expect(cervantesClient.isCurrentUserVerified()).rejects.toThrow()
      await expect(cervantesClient.getCurrentUserPermissions()).rejects.toThrow()
      await expect(cervantesClient.getCurrentUserProfile()).rejects.toThrow()
    })
  })
})