/**
 * CervantesClient Link Management Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {SuccessMessage} from '../domain/_shared/SuccessMessage.js'
import {Link} from '../domain/link/Link.js'
import {CervantesClient} from './CervantesClient.js'

// Mock the HTTP client
vi.mock('../infrastructure/http/HTTPClient.js')

describe('CervantesClient - Link Management', () => {
  let client: CervantesClient

  beforeEach(() => {
    client = new CervantesClient({
      baseURL: 'http://localhost:3000',
      debug: false
    })
  })

  describe('createLink', () => {
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

      // Mock the LinkService
      const linkService = client.getLinkService()
      vi.spyOn(linkService, 'create').mockResolvedValue(mockCreatedLink)

      // Act
      const result = await client.createLink(input)

      // Assert
      expect(result).toBe(mockCreatedLink)
      expect(linkService.create).toHaveBeenCalledWith(input)
    })
  })

  describe('findLinkByID', () => {
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

      // Mock the LinkService
      const linkService = client.getLinkService()
      vi.spyOn(linkService, 'findByID').mockResolvedValue(mockFoundLink)

      // Act
      const result = await client.findLinkByID(input)

      // Assert
      expect(result).toBe(mockFoundLink)
      expect(linkService.findByID).toHaveBeenCalledWith(input)
    })

    it('should return null when link not found', async () => {
      // Arrange
      const input = {id: 'nonexistent-id'}

      // Mock the LinkService
      const linkService = client.getLinkService()
      vi.spyOn(linkService, 'findByID').mockResolvedValue(null)

      // Act
      const result = await client.findLinkByID(input)

      // Assert
      expect(result).toBeNull()
      expect(linkService.findByID).toHaveBeenCalledWith(input)
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

      // Mock the LinkService
      const linkService = client.getLinkService()
      vi.spyOn(linkService, 'getLinksFromChapter').mockResolvedValue(mockLinks)

      // Act
      const result = await client.getLinksFromChapter(input)

      // Assert
      expect(result).toBe(mockLinks)
      expect(result).toHaveLength(2)
      expect(linkService.getLinksFromChapter).toHaveBeenCalledWith(input)
    })
  })

  describe('deleteLink', () => {
    it('should delete a link successfully', async () => {
      // Arrange
      const input = {id: 'test-link-id'}

      const mockSuccessMessage = SuccessMessage.fromAPI({
        message: 'Link deleted successfully'
      })

      // Mock the LinkService
      const linkService = client.getLinkService()
      vi.spyOn(linkService, 'delete').mockResolvedValue(mockSuccessMessage)

      // Act
      const result = await client.deleteLink(input)

      // Assert
      expect(result).toBe(mockSuccessMessage)
      expect(linkService.delete).toHaveBeenCalledWith(input)
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

      // Mock the LinkService
      const linkService = client.getLinkService()
      vi.spyOn(linkService, 'createOptionsLink').mockResolvedValue(mockCreatedLink)

      // Act
      const result = await client.createOptionsLink('chapter-1', 'chapter-2', 'Go to next chapter', 'book-1')

      // Assert
      expect(result).toBe(mockCreatedLink)
      expect(result.getKind()).toBe('options')
      expect(linkService.createOptionsLink).toHaveBeenCalledWith(
        'chapter-1',
        'chapter-2',
        'Go to next chapter',
        'book-1'
      )
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

      // Mock the LinkService
      const linkService = client.getLinkService()
      vi.spyOn(linkService, 'createDirectLink').mockResolvedValue(mockCreatedLink)

      // Act
      const result = await client.createDirectLink('chapter-1', 'chapter-2', 'Continue story', 'book-1')

      // Assert
      expect(result).toBe(mockCreatedLink)
      expect(result.getKind()).toBe('direct')
      expect(linkService.createDirectLink).toHaveBeenCalledWith('chapter-1', 'chapter-2', 'Continue story', 'book-1')
    })
  })

  describe('getLinkService', () => {
    it('should return the LinkService instance', () => {
      // Act
      const linkService = client.getLinkService()

      // Assert
      expect(linkService).toBeDefined()
      expect(typeof linkService.create).toBe('function')
      expect(typeof linkService.findByID).toBe('function')
      expect(typeof linkService.getLinksFromChapter).toBe('function')
      expect(typeof linkService.delete).toBe('function')
    })
  })
})
