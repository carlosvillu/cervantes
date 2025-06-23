/**
 * FindByIDLinkUseCase Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Link} from '../../../domain/link/Link.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'
import {FindByIDLinkUseCase} from './FindByIDLinkUseCase.js'

describe('FindByIDLinkUseCase', () => {
  let mockLinkRepository: LinkRepository
  let findByIDLinkUseCase: FindByIDLinkUseCase

  beforeEach(() => {
    mockLinkRepository = {
      create: vi.fn(),
      findByID: vi.fn(),
      getLinksFromChapter: vi.fn(),
      delete: vi.fn()
    }
    findByIDLinkUseCase = new FindByIDLinkUseCase(mockLinkRepository)
  })

  describe('execute', () => {
    it('should find a link successfully with valid ID', async () => {
      // Arrange
      const input = {
        id: 'test-link-id'
      }

      const mockFoundLink = Link.fromAPI({
        id: 'test-link-id',
        userID: 'test-user-id',
        bookID: 'book-1',
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options',
        body: 'Go to next chapter',
        createdAt: Date.now()
      })

      vi.mocked(mockLinkRepository.findByID).mockResolvedValue(mockFoundLink)

      // Act
      const result = await findByIDLinkUseCase.execute(input)

      // Assert
      expect(result).toBe(mockFoundLink)
      expect(mockLinkRepository.findByID).toHaveBeenCalledWith('test-link-id')
    })

    it('should return null when link is not found', async () => {
      // Arrange
      const input = {
        id: 'nonexistent-link-id'
      }

      vi.mocked(mockLinkRepository.findByID).mockResolvedValue(null)

      // Act
      const result = await findByIDLinkUseCase.execute(input)

      // Assert
      expect(result).toBeNull()
      expect(mockLinkRepository.findByID).toHaveBeenCalledWith('nonexistent-link-id')
    })

    it('should throw ValidationError when ID is missing', async () => {
      // Arrange
      const input = {
        id: ''
      }

      // Act & Assert
      await expect(findByIDLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(findByIDLinkUseCase.execute(input)).rejects.toThrow('Link ID is required')
    })

    it('should throw ValidationError when ID is only whitespace', async () => {
      // Arrange
      const input = {
        id: '   '
      }

      // Act & Assert
      await expect(findByIDLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(findByIDLinkUseCase.execute(input)).rejects.toThrow('Link ID cannot be empty')
    })

    it('should handle repository errors properly', async () => {
      // Arrange
      const input = {
        id: 'test-link-id'
      }

      const repositoryError = new Error('Repository error')
      vi.mocked(mockLinkRepository.findByID).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(findByIDLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(findByIDLinkUseCase.execute(input)).rejects.toThrow('Link lookup failed: Repository error')
    })
  })
})