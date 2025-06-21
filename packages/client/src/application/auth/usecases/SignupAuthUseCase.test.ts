import {beforeEach, describe, expect, it, vi} from 'vitest'

import {SuccessMessage} from '../../../domain/_shared/SuccessMessage.js'
import type {AuthRepository} from '../../../domain/auth/AuthRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'
import {SignupAuthUseCase} from './SignupAuthUseCase.js'

describe('SignupAuthUseCase', () => {
  let mockAuthRepository: AuthRepository
  let signupUseCase: SignupAuthUseCase

  beforeEach(() => {
    mockAuthRepository = {
      signup: vi.fn(),
      login: vi.fn(),
      refresh: vi.fn(),
      logout: vi.fn(),
      sendValidationCode: vi.fn(),
      verifyEmail: vi.fn(),
      getValidationToken: vi.fn()
    }

    signupUseCase = new SignupAuthUseCase(mockAuthRepository)
  })

  describe('execute', () => {
    it('should successfully execute signup with valid input', async () => {
      // Arrange
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      }

      const expectedResult = new SuccessMessage('User created successfully')
      vi.mocked(mockAuthRepository.signup).mockResolvedValue(expectedResult)

      // Act
      const result = await signupUseCase.execute(input)

      // Assert
      expect(result).toBe(expectedResult)
      expect(mockAuthRepository.signup).toHaveBeenCalledOnce()
    })

    it('should throw ValidationError for missing username', async () => {
      // Arrange
      const input = {
        username: '',
        email: 'test@example.com',
        password: 'Password123!'
      }

      // Act & Assert
      await expect(signupUseCase.execute(input)).rejects.toThrow(ValidationError)
      expect(mockAuthRepository.signup).not.toHaveBeenCalled()
    })

    it('should throw ValidationError for missing email', async () => {
      // Arrange
      const input = {
        username: 'testuser',
        email: '',
        password: 'Password123!'
      }

      // Act & Assert
      await expect(signupUseCase.execute(input)).rejects.toThrow(ValidationError)
      expect(mockAuthRepository.signup).not.toHaveBeenCalled()
    })

    it('should throw ValidationError for missing password', async () => {
      // Arrange
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: ''
      }

      // Act & Assert
      await expect(signupUseCase.execute(input)).rejects.toThrow(ValidationError)
      expect(mockAuthRepository.signup).not.toHaveBeenCalled()
    })

    it('should throw ValidationError for invalid email format', async () => {
      // Arrange
      const input = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password123!'
      }

      // Act & Assert
      await expect(signupUseCase.execute(input)).rejects.toThrow(ValidationError)
      expect(mockAuthRepository.signup).not.toHaveBeenCalled()
    })

    it('should throw ValidationError for short password', async () => {
      // Arrange
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'short'
      }

      // Act & Assert
      await expect(signupUseCase.execute(input)).rejects.toThrow(ValidationError)
      expect(mockAuthRepository.signup).not.toHaveBeenCalled()
    })

    it('should throw ValidationError for long username', async () => {
      // Arrange
      const input = {
        username: 'a'.repeat(51), // 51 characters
        email: 'test@example.com',
        password: 'Password123!'
      }

      // Act & Assert
      await expect(signupUseCase.execute(input)).rejects.toThrow(ValidationError)
      expect(mockAuthRepository.signup).not.toHaveBeenCalled()
    })

    it('should throw ValidationError for very long password', async () => {
      // Arrange
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'a'.repeat(101) // 101 characters
      }

      // Act & Assert
      await expect(signupUseCase.execute(input)).rejects.toThrow(ValidationError)
      expect(mockAuthRepository.signup).not.toHaveBeenCalled()
    })

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const input = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      }

      const repositoryError = new Error('Database connection failed')
      vi.mocked(mockAuthRepository.signup).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(signupUseCase.execute(input)).rejects.toThrow(ValidationError)
      expect(mockAuthRepository.signup).toHaveBeenCalledOnce()
    })
  })
})
