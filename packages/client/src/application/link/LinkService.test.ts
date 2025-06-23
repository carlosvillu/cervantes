/**
 * LinkService Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {SuccessMessage} from '../../domain/_shared/SuccessMessage.js'
import {Link} from '../../domain/link/Link.js'
import type {LinkRepository} from '../../domain/link/LinkRepository.js'
import {LinkService} from './LinkService.js'

describe('LinkService', () => {
  let mockLinkRepository: LinkRepository
  let linkService: LinkService

  beforeEach(() => {
    mockLinkRepository = {
      create: vi.fn(),
      findByID: vi.fn(),
      getLinksFromChapter: vi.fn(),
      delete: vi.fn()
    }
    linkService = new LinkService({repository: mockLinkRepository})
  })

  describe('create', () => {
    it('should create a link successfully', async () => {
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
      const result = await linkService.create(input)

      // Assert
      expect(result).toBe(mockCreatedLink)
    })
  })

  describe('findByID', () => {
    it('should find a link by ID successfully', async () => {
      // Arrange
      const input = {id: 'test-link-id'}

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
      const result = await linkService.findByID(input)

      // Assert
      expect(result).toBe(mockFoundLink)
    })

    it('should return null when link not found', async () => {
      // Arrange
      const input = {id: 'nonexistent-id'}

      vi.mocked(mockLinkRepository.findByID).mockResolvedValue(null)

      // Act
      const result = await linkService.findByID(input)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('getLinksFromChapter', () => {
    it('should get links from chapter successfully', async () => {
      // Arrange
      const input = {fromChapterID: 'chapter-1'}

      const mockLinks = [
        Link.fromAPI({
          id: 'link-1',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-2',
          kind: 'options',
          body: 'Option 1',
          createdAt: Date.now()
        }),
        Link.fromAPI({
          id: 'link-2',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-3',
          kind: 'direct',
          body: 'Continue',
          createdAt: Date.now()
        })
      ]

      vi.mocked(mockLinkRepository.getLinksFromChapter).mockResolvedValue(mockLinks)

      // Act
      const result = await linkService.getLinksFromChapter(input)

      // Assert
      expect(result).toBe(mockLinks)
      expect(result).toHaveLength(2)
    })
  })

  describe('delete', () => {
    it('should delete a link successfully', async () => {
      // Arrange
      const input = {id: 'test-link-id'}

      const mockSuccessMessage = SuccessMessage.fromAPI({
        message: 'Link deleted successfully'
      })

      vi.mocked(mockLinkRepository.delete).mockResolvedValue(mockSuccessMessage)

      // Act
      const result = await linkService.delete(input)

      // Assert
      expect(result).toBe(mockSuccessMessage)
    })
  })

  describe('createOptionsLink', () => {
    it('should create an options link successfully', async () => {
      // Arrange
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
      const result = await linkService.createOptionsLink('chapter-1', 'chapter-2', 'Go to next chapter', 'book-1')

      // Assert
      expect(result).toBe(mockCreatedLink)
      expect(result.getKind()).toBe('options')
    })
  })

  describe('createDirectLink', () => {
    it('should create a direct link successfully', async () => {
      // Arrange
      const mockCreatedLink = Link.fromAPI({
        id: 'test-link-id',
        userID: 'test-user-id',
        bookID: 'book-1',
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'direct',
        body: 'Continue story',
        createdAt: Date.now()
      })

      vi.mocked(mockLinkRepository.create).mockResolvedValue(mockCreatedLink)

      // Act
      const result = await linkService.createDirectLink('chapter-1', 'chapter-2', 'Continue story', 'book-1')

      // Assert
      expect(result).toBe(mockCreatedLink)
      expect(result.getKind()).toBe('direct')
    })
  })

  describe('getOptionsFromChapter', () => {
    it('should get only option-type links from chapter', async () => {
      // Arrange
      const mockLinks = [
        Link.fromAPI({
          id: 'link-1',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-2',
          kind: 'options',
          body: 'Option 1',
          createdAt: Date.now()
        }),
        Link.fromAPI({
          id: 'link-2',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-3',
          kind: 'direct',
          body: 'Continue',
          createdAt: Date.now()
        }),
        Link.fromAPI({
          id: 'link-3',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-4',
          kind: 'options',
          body: 'Option 2',
          createdAt: Date.now()
        })
      ]

      vi.mocked(mockLinkRepository.getLinksFromChapter).mockResolvedValue(mockLinks)

      // Act
      const result = await linkService.getOptionsFromChapter('chapter-1')

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].getKind()).toBe('options')
      expect(result[1].getKind()).toBe('options')
    })
  })

  describe('getDirectLinksFromChapter', () => {
    it('should get only direct-type links from chapter', async () => {
      // Arrange
      const mockLinks = [
        Link.fromAPI({
          id: 'link-1',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-2',
          kind: 'options',
          body: 'Option 1',
          createdAt: Date.now()
        }),
        Link.fromAPI({
          id: 'link-2',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-3',
          kind: 'direct',
          body: 'Continue',
          createdAt: Date.now()
        })
      ]

      vi.mocked(mockLinkRepository.getLinksFromChapter).mockResolvedValue(mockLinks)

      // Act
      const result = await linkService.getDirectLinksFromChapter('chapter-1')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].getKind()).toBe('direct')
    })
  })

  describe('getLinksWithDescriptionsFromChapter', () => {
    it('should get only links with descriptions from chapter', async () => {
      // Arrange
      const mockLinks = [
        Link.fromAPI({
          id: 'link-1',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-2',
          kind: 'options',
          body: 'Option with description',
          createdAt: Date.now()
        }),
        Link.fromAPI({
          id: 'link-2',
          userID: 'test-user-id',
          bookID: 'book-1',
          from: 'chapter-1',
          to: 'chapter-3',
          kind: 'direct',
          body: '', // Empty body
          createdAt: Date.now()
        })
      ]

      vi.mocked(mockLinkRepository.getLinksFromChapter).mockResolvedValue(mockLinks)

      // Act
      const result = await linkService.getLinksWithDescriptionsFromChapter('chapter-1')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].hasDescription()).toBe(true)
    })
  })

  describe('exists', () => {
    it('should return true when link exists', async () => {
      // Arrange
      const mockFoundLink = Link.fromAPI({
        id: 'test-link-id',
        userID: 'test-user-id',
        bookID: 'book-1',
        from: 'chapter-1',
        to: 'chapter-2',
        kind: 'options',
        body: 'Test link',
        createdAt: Date.now()
      })

      vi.mocked(mockLinkRepository.findByID).mockResolvedValue(mockFoundLink)

      // Act
      const result = await linkService.exists('test-link-id')

      // Assert
      expect(result).toBe(true)
    })

    it('should return false when link does not exist', async () => {
      // Arrange
      vi.mocked(mockLinkRepository.findByID).mockResolvedValue(null)

      // Act
      const result = await linkService.exists('nonexistent-id')

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('deleteAndConfirm', () => {
    it('should return true when deletion succeeds', async () => {
      // Arrange
      const mockSuccessMessage = SuccessMessage.fromAPI({
        message: 'Link deleted successfully'
      })

      vi.mocked(mockLinkRepository.delete).mockResolvedValue(mockSuccessMessage)

      // Act
      const result = await linkService.deleteAndConfirm('test-link-id')

      // Assert
      expect(result).toBe(true)
    })

    it('should return false when deletion fails', async () => {
      // Arrange
      vi.mocked(mockLinkRepository.delete).mockRejectedValue(new Error('Deletion failed'))

      // Act
      const result = await linkService.deleteAndConfirm('test-link-id')

      // Assert
      expect(result).toBe(false)
    })
  })
})
