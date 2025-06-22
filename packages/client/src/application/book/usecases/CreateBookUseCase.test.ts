/**
 * CreateBookUseCase Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Book} from '../../../domain/book/Book.js'
import type {BookRepository} from '../../../domain/book/BookRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'
import {CreateBookUseCase} from './CreateBookUseCase.js'

describe('CreateBookUseCase', () => {
  let mockBookRepository: BookRepository
  let createBookUseCase: CreateBookUseCase

  beforeEach(() => {
    mockBookRepository = {
      create: vi.fn(),
      findByID: vi.fn(),
      getAll: vi.fn(),
      update: vi.fn()
    }
    createBookUseCase = new CreateBookUseCase(mockBookRepository)
  })

  describe('execute', () => {
    it('should create a book successfully with valid input', async () => {
      // Arrange
      const input = {
        title: 'Test Book',
        summary: 'A test book summary'
      }

      const mockCreatedBook = Book.fromAPI({
        id: 'test-book-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: false,
        rootChapterID: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      vi.mocked(mockBookRepository.create).mockResolvedValue(mockCreatedBook)

      // Act
      const result = await createBookUseCase.execute(input)

      // Assert
      expect(result).toBe(mockCreatedBook)
      expect(mockBookRepository.create).toHaveBeenCalledOnce()

      const createBookRequest = vi.mocked(mockBookRepository.create).mock.calls[0][0]
      expect(createBookRequest.getTitle()).toBe('Test Book')
      expect(createBookRequest.getSummary()).toBe('A test book summary')
    })

    it('should create a book with custom ID when provided', async () => {
      // Arrange
      const input = {
        title: 'Test Book',
        summary: 'A test book summary',
        id: 'custom-id'
      }

      const mockCreatedBook = Book.fromAPI({
        id: 'custom-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: false,
        rootChapterID: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      vi.mocked(mockBookRepository.create).mockResolvedValue(mockCreatedBook)

      // Act
      const result = await createBookUseCase.execute(input)

      // Assert
      expect(result).toBe(mockCreatedBook)

      const createBookRequest = vi.mocked(mockBookRepository.create).mock.calls[0][0]
      expect(createBookRequest.getId()).toBe('custom-id')
    })

    it('should throw ValidationError when title is empty', async () => {
      // Arrange
      const input = {
        title: '',
        summary: 'A test book summary'
      }

      // Act & Assert
      await expect(createBookUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBookUseCase.execute(input)).rejects.toThrow('Title is required')
      expect(mockBookRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ValidationError when summary is empty', async () => {
      // Arrange
      const input = {
        title: 'Test Book',
        summary: ''
      }

      // Act & Assert
      await expect(createBookUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBookUseCase.execute(input)).rejects.toThrow('Summary is required')
      expect(mockBookRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ValidationError when title is too long', async () => {
      // Arrange
      const input = {
        title: 'A'.repeat(201), // Too long
        summary: 'A test book summary'
      }

      // Act & Assert
      await expect(createBookUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBookUseCase.execute(input)).rejects.toThrow('Title must be 200 characters or less')
      expect(mockBookRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ValidationError when summary is too long', async () => {
      // Arrange
      const input = {
        title: 'Test Book',
        summary: 'A'.repeat(1001) // Too long
      }

      // Act & Assert
      await expect(createBookUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBookUseCase.execute(input)).rejects.toThrow('Summary must be 1000 characters or less')
      expect(mockBookRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ValidationError when title contains only whitespace', async () => {
      // Arrange
      const input = {
        title: '   \n\t   ',
        summary: 'A test book summary'
      }

      // Act & Assert
      await expect(createBookUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBookUseCase.execute(input)).rejects.toThrow('Title cannot contain only whitespace')
      expect(mockBookRepository.create).not.toHaveBeenCalled()
    })

    it('should rethrow repository errors with proper context', async () => {
      // Arrange
      const input = {
        title: 'Test Book',
        summary: 'A test book summary'
      }

      const repositoryError = new Error('Repository failed')
      vi.mocked(mockBookRepository.create).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(createBookUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createBookUseCase.execute(input)).rejects.toThrow('Book creation failed: Repository failed')
    })
  })
})
