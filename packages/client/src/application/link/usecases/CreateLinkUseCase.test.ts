/**
 * CreateLinkUseCase Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Link} from '../../../domain/link/Link.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'
import {CreateLinkUseCase} from './CreateLinkUseCase.js'

describe('CreateLinkUseCase', () => {
  let mockLinkRepository: LinkRepository
  let createLinkUseCase: CreateLinkUseCase

  beforeEach(() => {
    mockLinkRepository = {
      create: vi.fn(),
      findByID: vi.fn(),
      getLinksFromChapter: vi.fn(),
      delete: vi.fn()
    }
    createLinkUseCase = new CreateLinkUseCase(mockLinkRepository)
  })

  describe('execute', () => {
    it('should create a link successfully with valid input', async () => {
      // Arrange
      const input = {
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options' as const,
        body: 'Go to next chapter',
        bookID: 'book-1'
      }

      const mockCreatedLink = Link.fromAPI({
        id: 'test-link-id',
        userID: 'test-user-id',
        bookID: 'book-1',
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options',
        body: 'Go to next chapter',
        createdAt: Date.now()
      })

      vi.mocked(mockLinkRepository.create).mockResolvedValue(mockCreatedLink)

      // Act
      const result = await createLinkUseCase.execute(input)

      // Assert
      expect(result).toBe(mockCreatedLink)
      expect(mockLinkRepository.create).toHaveBeenCalledOnce()
    })

    it('should create a link with custom ID when provided', async () => {
      // Arrange
      const input = {
        id: 'custom-link-id',
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'direct' as const,
        body: 'Direct connection',
        bookID: 'book-1'
      }

      const mockCreatedLink = Link.fromAPI({
        id: 'custom-link-id',
        userID: 'test-user-id',
        bookID: 'book-1',
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'direct',
        body: 'Direct connection',
        createdAt: Date.now()
      })

      vi.mocked(mockLinkRepository.create).mockResolvedValue(mockCreatedLink)

      // Act
      const result = await createLinkUseCase.execute(input)

      // Assert
      expect(result).toBe(mockCreatedLink)
      expect(mockLinkRepository.create).toHaveBeenCalledOnce()
    })

    it('should throw ValidationError when from chapter ID is missing', async () => {
      // Arrange
      const input = {
        from: '',
        to: 'chapter-2',
        kind: 'options' as const,
        body: 'Go to next chapter',
        bookID: 'book-1'
      }

      // Act & Assert
      await expect(createLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createLinkUseCase.execute(input)).rejects.toThrow('From chapter ID is required')
    })

    it('should throw ValidationError when to chapter ID is missing', async () => {
      // Arrange
      const input = {
        from: 'chapter-1',
        to: '',
        kind: 'options' as const,
        body: 'Go to next chapter',
        bookID: 'book-1'
      }

      // Act & Assert
      await expect(createLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createLinkUseCase.execute(input)).rejects.toThrow('To chapter ID is required')
    })

    it('should throw ValidationError when book ID is missing', async () => {
      // Arrange
      const input = {
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options' as const,
        body: 'Go to next chapter',
        bookID: ''
      }

      // Act & Assert
      await expect(createLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createLinkUseCase.execute(input)).rejects.toThrow('Book ID is required')
    })

    it('should throw ValidationError when from and to are the same (self-reference)', async () => {
      // Arrange
      const input = {
        from: 'chapter-1',
        to: 'chapter-1',
        kind: 'options' as const,
        body: 'Self reference',
        bookID: 'book-1'
      }

      // Act & Assert
      await expect(createLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createLinkUseCase.execute(input)).rejects.toThrow('from and to cannot be the same')
    })

    it('should throw ValidationError when kind is invalid', async () => {
      // Arrange
      const input = {
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'invalid' as any,
        body: 'Go to next chapter',
        bookID: 'book-1'
      }

      // Act & Assert
      await expect(createLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createLinkUseCase.execute(input)).rejects.toThrow('Link kind must be either "options" or "direct"')
    })

    it('should throw ValidationError when body is null or undefined', async () => {
      // Arrange
      const input = {
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options' as const,
        body: null as any,
        bookID: 'book-1'
      }

      // Act & Assert
      await expect(createLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createLinkUseCase.execute(input)).rejects.toThrow('Link body is required')
    })

    it('should allow empty body string', async () => {
      // Arrange
      const input = {
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options' as const,
        body: '',
        bookID: 'book-1'
      }

      const mockCreatedLink = Link.fromAPI({
        id: 'test-link-id',
        userID: 'test-user-id',
        bookID: 'book-1',
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options',
        body: '',
        createdAt: Date.now()
      })

      vi.mocked(mockLinkRepository.create).mockResolvedValue(mockCreatedLink)

      // Act
      const result = await createLinkUseCase.execute(input)

      // Assert
      expect(result).toBe(mockCreatedLink)
    })

    it('should handle repository errors properly', async () => {
      // Arrange
      const input = {
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options' as const,
        body: 'Go to next chapter',
        bookID: 'book-1'
      }

      const repositoryError = new Error('Repository error')
      vi.mocked(mockLinkRepository.create).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(createLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(createLinkUseCase.execute(input)).rejects.toThrow('Link creation failed: Repository error')
    })
  })
})