/**
 * GetCurrentUserUseCase Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {User} from '../../../domain/user/User.js'
import type {UserRepository} from '../../../domain/user/UserRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'
import {GetCurrentUserUseCase} from './GetCurrentUserUseCase.js'

describe('GetCurrentUserUseCase', () => {
  let mockUserRepository: UserRepository
  let getCurrentUserUseCase: GetCurrentUserUseCase

  beforeEach(() => {
    mockUserRepository = {
      getCurrentUser: vi.fn()
    }
    getCurrentUserUseCase = new GetCurrentUserUseCase(mockUserRepository)
  })

  describe('execute', () => {
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
      const result = await getCurrentUserUseCase.execute({})

      // Assert
      expect(result).toBe(mockUser)
      expect(mockUserRepository.getCurrentUser).toHaveBeenCalledOnce()
    })

    it('should handle repository errors properly', async () => {
      // Arrange
      const repositoryError = new Error('Repository failed')
      vi.mocked(mockUserRepository.getCurrentUser).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(getCurrentUserUseCase.execute({})).rejects.toThrow(ValidationError)
      await expect(getCurrentUserUseCase.execute({})).rejects.toThrow('Failed to get current user: Repository failed')
    })

    it('should re-throw non-Error instances as-is', async () => {
      // Arrange
      const nonErrorObject = {message: 'Not an error instance'}
      vi.mocked(mockUserRepository.getCurrentUser).mockRejectedValue(nonErrorObject)

      // Act & Assert
      await expect(getCurrentUserUseCase.execute({})).rejects.toBe(nonErrorObject)
    })
  })

  describe('input validation', () => {
    it('should reject null input', async () => {
      // Act & Assert
      await expect(getCurrentUserUseCase.execute(null as any)).rejects.toThrow(ValidationError)
      await expect(getCurrentUserUseCase.execute(null as any)).rejects.toThrow('Input cannot be null or undefined')
    })

    it('should reject undefined input', async () => {
      // Act & Assert
      await expect(getCurrentUserUseCase.execute(undefined as any)).rejects.toThrow(ValidationError)
      await expect(getCurrentUserUseCase.execute(undefined as any)).rejects.toThrow('Input cannot be null or undefined')
    })

    it('should accept empty object as valid input', async () => {
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
      const result = await getCurrentUserUseCase.execute({})

      // Assert
      expect(result).toBe(mockUser)
    })
  })

  describe('error handling scenarios', () => {
    it('should provide proper error context when repository fails', async () => {
      // Arrange
      const originalError = new Error('Network timeout')
      vi.mocked(mockUserRepository.getCurrentUser).mockRejectedValue(originalError)

      // Act & Assert
      try {
        await getCurrentUserUseCase.execute({})
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as ValidationError).message).toBe('Failed to get current user: Network timeout')
        expect((error as ValidationError).cause).toBe(originalError)
      }
    })

    it('should handle authentication errors from repository', async () => {
      // Arrange
      const authError = new Error('Unauthorized')
      vi.mocked(mockUserRepository.getCurrentUser).mockRejectedValue(authError)

      // Act & Assert
      await expect(getCurrentUserUseCase.execute({})).rejects.toThrow(ValidationError)
      await expect(getCurrentUserUseCase.execute({})).rejects.toThrow('Failed to get current user: Unauthorized')
    })
  })
})
