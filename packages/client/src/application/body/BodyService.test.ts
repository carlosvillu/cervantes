/**
 * BodyService Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Body} from '../../domain/body/Body.js'
import type {BodyRepository} from '../../domain/body/BodyRepository.js'
import {BodyService} from './BodyService.js'

describe('BodyService', () => {
  let mockBodyRepository: BodyRepository
  let bodyService: BodyService

  beforeEach(() => {
    mockBodyRepository = {
      create: vi.fn(),
      findByHash: vi.fn(),
      findByID: vi.fn(),
      getAllByChapter: vi.fn()
    }
    bodyService = new BodyService({repository: mockBodyRepository})
  })

  describe('create', () => {
    it('should create a body successfully', async () => {
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
        content: 'Test content'
      }

      // Act
      const result = await bodyService.create(input)

      // Assert
      expect(result).toBe(mockCreatedBody)
      expect(mockBodyRepository.create).toHaveBeenCalledOnce()
    })

    it('should handle repository errors', async () => {
      // Arrange
      const error = new Error('Repository error')
      vi.mocked(mockBodyRepository.create).mockRejectedValue(error)

      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        userID: '87654321-4321-4321-4321-210987654321',
        chapterID: '11111111-2222-3333-4444-555555555555',
        content: 'Test content'
      }

      // Act & Assert
      await expect(bodyService.create(input)).rejects.toThrow('Repository error')
    })
  })

  describe('findByHash', () => {
    it('should find a body by hash successfully', async () => {
      // Arrange
      const mockBody = Body.fromAPI({
        id: 'test-body-id',
        userID: 'test-user-id',
        bookID: 'test-book-id',
        chapterID: 'test-chapter-id',
        content: 'Test content',
        hash: 'test-hash',
        createdAt: Date.now()
      })

      vi.mocked(mockBodyRepository.findByHash).mockResolvedValue(mockBody)

      const input = {hash: 'test-hash'}

      // Act
      const result = await bodyService.findByHash(input)

      // Assert
      expect(result).toBe(mockBody)
      expect(mockBodyRepository.findByHash).toHaveBeenCalledWith('test-hash')
    })

    it('should handle repository errors', async () => {
      // Arrange
      const error = new Error('Body not found')
      vi.mocked(mockBodyRepository.findByHash).mockRejectedValue(error)

      const input = {hash: 'non-existent-hash'}

      // Act & Assert
      await expect(bodyService.findByHash(input)).rejects.toThrow('Body not found')
    })
  })

  describe('findByID', () => {
    it('should find a body by ID successfully', async () => {
      // Arrange
      const mockBody = Body.fromAPI({
        id: 'test-body-id',
        userID: 'test-user-id',
        bookID: 'test-book-id',
        chapterID: 'test-chapter-id',
        content: 'Test content',
        hash: 'test-hash',
        createdAt: Date.now()
      })

      vi.mocked(mockBodyRepository.findByID).mockResolvedValue(mockBody)

      const input = {id: '99999999-9999-9999-9999-999999999999'}

      // Act
      const result = await bodyService.findByID(input)

      // Assert
      expect(result).toBe(mockBody)
      expect(mockBodyRepository.findByID).toHaveBeenCalledWith('99999999-9999-9999-9999-999999999999')
    })

    it('should handle repository errors', async () => {
      // Arrange
      const error = new Error('Body not found')
      vi.mocked(mockBodyRepository.findByID).mockRejectedValue(error)

      const input = {id: '99999999-9999-9999-9999-999999999999'}

      // Act & Assert
      await expect(bodyService.findByID(input)).rejects.toThrow('Body not found')
    })
  })

  describe('getAllByChapter', () => {
    it('should get all bodies for a chapter successfully', async () => {
      // Arrange
      const mockBodies = [
        Body.fromAPI({
          id: 'test-body-1',
          userID: 'test-user-id',
          bookID: 'test-book-id',
          chapterID: 'test-chapter-id',
          content: 'Test content 1',
          hash: 'test-hash-1',
          createdAt: Date.now()
        }),
        Body.fromAPI({
          id: 'test-body-2',
          userID: 'test-user-id',
          bookID: 'test-book-id',
          chapterID: 'test-chapter-id',
          content: 'Test content 2',
          hash: 'test-hash-2',
          createdAt: Date.now() + 1000
        })
      ]

      vi.mocked(mockBodyRepository.getAllByChapter).mockResolvedValue(mockBodies)

      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        chapterID: '11111111-2222-3333-4444-555555555555'
      }

      // Act
      const result = await bodyService.getAllByChapter(input)

      // Assert
      expect(result).toBe(mockBodies)
      expect(mockBodyRepository.getAllByChapter).toHaveBeenCalledWith(
        '12345678-1234-1234-1234-123456789012',
        '11111111-2222-3333-4444-555555555555'
      )
    })

    it('should handle repository errors', async () => {
      // Arrange
      const error = new Error('Chapter not found')
      vi.mocked(mockBodyRepository.getAllByChapter).mockRejectedValue(error)

      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        chapterID: '11111111-2222-3333-4444-555555555555'
      }

      // Act & Assert
      await expect(bodyService.getAllByChapter(input)).rejects.toThrow('Chapter not found')
    })

    it('should return empty array when no bodies exist', async () => {
      // Arrange
      vi.mocked(mockBodyRepository.getAllByChapter).mockResolvedValue([])

      const input = {
        bookID: '12345678-1234-1234-1234-123456789012',
        chapterID: '11111111-2222-3333-4444-555555555555'
      }

      // Act
      const result = await bodyService.getAllByChapter(input)

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })

  describe('getRepository', () => {
    it('should return the body repository instance', () => {
      // Act
      const result = bodyService.getRepository()

      // Assert
      expect(result).toBe(mockBodyRepository)
    })
  })
})
