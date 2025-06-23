/**
 * CreateBodyUseCase Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Body} from '../../../domain/body/Body.js'
import type {BodyRepository} from '../../../domain/body/BodyRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'
import {CreateBodyUseCase} from './CreateBodyUseCase.js'

describe('CreateBodyUseCase', () => {
  let mockBodyRepository: BodyRepository
  let createBodyUseCase: CreateBodyUseCase

  beforeEach(() => {
    mockBodyRepository = {
      create: vi.fn(),
      findByHash: vi.fn(),
      findByID: vi.fn(),
      getAllByChapter: vi.fn()
    }
    createBodyUseCase = new CreateBodyUseCase(mockBodyRepository)
  })

  describe('execute', () => {
    it('should create a body successfully with valid input', async () => {
      // Arrange
      const mockCreatedBody = Body.fromAPI({
        id: 'test-body-id',
        userID: 'test-user-id',
        bookID: 'test-book-id',
        chapterID: 'test-chapter-id',
        content: 'Test content',
        hash: 'test-hash',
        createdAt: Date.now()
      })

      vi.mocked(mockBodyRepository.create).mockResolvedValue(mockCreatedBody)

      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: 'This is some test content for the chapter'
      }

      // Act
      const result = await createBodyUseCase.execute(input)

      // Assert
      expect(result).toBe(mockCreatedBody)
      expect(mockBodyRepository.create).toHaveBeenCalledOnce()
    })

    it('should create a body with custom ID when provided', async () => {
      // Arrange
      const customId = '99999999-9999-9999-9999-999999999999'
      const mockCreatedBody = Body.fromAPI({
        id: customId,
        userID: 'test-user-id',
        bookID: 'test-book-id',
        chapterID: 'test-chapter-id',
        content: 'Test content',
        hash: 'test-hash',
        createdAt: Date.now()
      })

      vi.mocked(mockBodyRepository.create).mockResolvedValue(mockCreatedBody)

      const input = {
        id: customId,
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: 'This is some test content for the chapter'
      }

      // Act
      const result = await createBodyUseCase.execute(input)

      // Assert
      expect(result).toBe(mockCreatedBody)
      expect(mockBodyRepository.create).toHaveBeenCalledOnce()
    })

    it('should allow empty content', async () => {
      // Arrange
      const mockCreatedBody = Body.fromAPI({
        id: 'test-body-id',
        userID: 'test-user-id',
        bookID: 'test-book-id',
        chapterID: 'test-chapter-id',
        content: '',
        hash: 'test-hash',
        createdAt: Date.now()
      })

      vi.mocked(mockBodyRepository.create).mockResolvedValue(mockCreatedBody)

      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: ''
      }

      // Act
      const result = await createBodyUseCase.execute(input)

      // Assert
      expect(result).toBe(mockCreatedBody)
    })

    it('should throw ValidationError when bookID is missing', async () => {
      // Arrange
      const input = {
        bookID: '',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: 'Test content'
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('Book ID is required')
    })

    it('should throw ValidationError when userID is missing', async () => {
      // Arrange
      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: 'Test content'
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('User ID is required')
    })

    it('should throw ValidationError when chapterID is missing', async () => {
      // Arrange
      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '',
        content: 'Test content'
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('Chapter ID is required')
    })

    it('should throw ValidationError when content is undefined', async () => {
      // Arrange
      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: undefined as any
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('Content is required')
    })

    it('should throw ValidationError when bookID is not a valid UUID', async () => {
      // Arrange
      const input = {
        bookID: 'invalid-uuid',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: 'Test content'
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('Book ID must be a valid UUID')
    })

    it('should throw ValidationError when userID is not a valid UUID', async () => {
      // Arrange
      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: 'invalid-uuid',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: 'Test content'
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('User ID must be a valid UUID')
    })

    it('should throw ValidationError when chapterID is not a valid UUID', async () => {
      // Arrange
      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: 'invalid-uuid',
        content: 'Test content'
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('Chapter ID must be a valid UUID')
    })

    it('should throw ValidationError when content is too long', async () => {
      // Arrange
      const longContent = 'x'.repeat(1000001) // 1,000,001 characters
      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: longContent
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('Content must be 1,000,000 characters or less')
    })

    it('should handle repository errors and wrap them properly', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      vi.mocked(mockBodyRepository.create).mockRejectedValue(repositoryError)

      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: 'Test content'
      }

      // Act & Assert
      await expect(createBodyUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBodyUseCase.execute(input)).rejects.toThrow('Body creation failed: Database connection failed')
    })
  })
})
