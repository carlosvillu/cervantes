/**
 * GetLinksFromChapterUseCase Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Link} from '../../../domain/link/Link.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'
import {GetLinksFromChapterUseCase} from './GetLinksFromChapterUseCase.js'

describe('GetLinksFromChapterUseCase', () => {
  let mockLinkRepository: LinkRepository
  let getLinksFromChapterUseCase: GetLinksFromChapterUseCase

  beforeEach(() => {
    mockLinkRepository = {
      create: vi.fn(),
      findByID: vi.fn(),
      getLinksFromChapter: vi.fn(),
      delete: vi.fn()
    }
    getLinksFromChapterUseCase = new GetLinksFromChapterUseCase(mockLinkRepository)
  })

  describe('execute', () => {
    it('should get links successfully with valid chapter ID', async () => {
      // Arrange
      const input = {
        fromChapterID: 'chapter-1'
      }

      const mockLinks = [
        Link.fromAPI({
          id: 'link-1',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-2',
          kind: 'options',
          body: 'Go to chapter 2',
          createdAt: Date.now()
        }),
        Link.fromAPI({
          id: 'link-2',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-3',
          kind: 'direct',
          body: 'Continue to chapter 3',
          createdAt: Date.now()
        })
      ]

      vi.mocked(mockLinkRepository.getLinksFromChapter).mockResolvedValue(mockLinks)

      // Act
      const result = await getLinksFromChapterUseCase.execute(input)

      // Assert
      expect(result).toBe(mockLinks)
      expect(result).toHaveLength(2)
      expect(mockLinkRepository.getLinksFromChapter).toHaveBeenCalledWith('chapter-1')
    })

    it('should return empty array when no links found', async () => {
      // Arrange
      const input = {
        fromChapterID: 'chapter-with-no-links'
      }

      vi.mocked(mockLinkRepository.getLinksFromChapter).mockResolvedValue([])

      // Act
      const result = await getLinksFromChapterUseCase.execute(input)

      // Assert
      expect(result).toEqual([])
      expect(mockLinkRepository.getLinksFromChapter).toHaveBeenCalledWith('chapter-with-no-links')
    })

    it('should throw ValidationError when fromChapterID is missing', async () => {
      // Arrange
      const input = {
        fromChapterID: ''
      }

      // Act & Assert
      await expect(getLinksFromChapterUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(getLinksFromChapterUseCase.execute(input)).rejects.toThrow('From chapter ID is required')
    })

    it('should throw ValidationError when fromChapterID is only whitespace', async () => {
      // Arrange
      const input = {
        fromChapterID: '   '
      }

      // Act & Assert
      await expect(getLinksFromChapterUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(getLinksFromChapterUseCase.execute(input)).rejects.toThrow('From chapter ID cannot be empty')
    })

    it('should handle repository errors properly', async () => {
      // Arrange
      const input = {
        fromChapterID: 'chapter-1'
      }

      const repositoryError = new Error('Repository error')
      vi.mocked(mockLinkRepository.getLinksFromChapter).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(getLinksFromChapterUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(getLinksFromChapterUseCase.execute(input)).rejects.toThrow('Links lookup failed: Repository error')
    })
  })
})
