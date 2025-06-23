/**
 * HTTPBodyRepository Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Body} from '../../../domain/body/Body.js'
import {CreateBodyRequest} from '../../../domain/body/CreateBodyRequest.js'
import {NetworkError} from '../errors/NetworkError.js'
import type {HTTPClient} from '../types.js'
import {HTTPBodyRepository} from './HTTPBodyRepository.js'

describe('HTTPBodyRepository', () => {
  let mockHTTPClient: HTTPClient
  let bodyRepository: HTTPBodyRepository

  beforeEach(() => {
    mockHTTPClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      setAuthTokens: vi.fn(),
      clearAuthTokens: vi.fn(),
      hasValidTokens: vi.fn()
    }
    bodyRepository = new HTTPBodyRepository(mockHTTPClient)
  })

  describe('create', () => {
    it('should create a body successfully', async () => {
      // Arrange
      const createRequest = CreateBodyRequest.fromAPI({
        id: 'test-body-id',
        bookID: 'test-book-id',
        userID: 'test-user-id',
        chapterID: 'test-chapter-id',
        content: 'Test content'
      })

      const mockResponseData = {
        id: 'test-body-id',
        userID: 'test-user-id',
        bookID: 'test-book-id',
        chapterID: 'test-chapter-id',
        content: 'Test content',
        hash: 'generated-hash',
        createdAt: Date.now()
      }

      vi.mocked(mockHTTPClient.post).mockResolvedValue([undefined, mockResponseData])

      // Act
      const result = await bodyRepository.create(createRequest)

      // Assert
      expect(result).toBeInstanceOf(Body)
      expect(result.getId()).toBe('test-body-id')
      expect(result.getContent()).toBe('Test content')
      expect(result.getHash()).toBe('generated-hash')
      expect(mockHTTPClient.post).toHaveBeenCalledWith(
        '/body',
        {body: createRequest.toAPI()},
        expect.any(Object) // BodyValidationSchema
      )
    })

    it('should throw error when HTTP client returns error', async () => {
      // Arrange
      const createRequest = CreateBodyRequest.fromAPI({
        id: 'test-body-id',
        bookID: 'test-book-id',
        userID: 'test-user-id',
        chapterID: 'test-chapter-id',
        content: 'Test content'
      })

      const networkError = new NetworkError('Network failure')
      vi.mocked(mockHTTPClient.post).mockResolvedValue([networkError, null])

      // Act & Assert
      await expect(bodyRepository.create(createRequest)).rejects.toThrow(NetworkError)
      await expect(bodyRepository.create(createRequest)).rejects.toThrow('Network failure')
    })
  })

  describe('findByHash', () => {
    it('should find a body by hash successfully', async () => {
      // Arrange
      const hash = 'test-hash'
      const mockResponseData = {
        id: 'test-body-id',
        userID: 'test-user-id',
        bookID: 'test-book-id',
        chapterID: 'test-chapter-id',
        content: 'Test content',
        hash,
        createdAt: Date.now()
      }

      vi.mocked(mockHTTPClient.get).mockResolvedValue([undefined, mockResponseData])

      // Act
      const result = await bodyRepository.findByHash(hash)

      // Assert
      expect(result).toBeInstanceOf(Body)
      expect(result.getHash()).toBe(hash)
      expect(mockHTTPClient.get).toHaveBeenCalledWith(
        `/body?hash=${hash}`,
        {},
        expect.any(Object) // BodyValidationSchema
      )
    })

    it('should throw error when body not found', async () => {
      // Arrange
      const hash = 'non-existent-hash'
      const networkError = new NetworkError('Body not found')
      vi.mocked(mockHTTPClient.get).mockResolvedValue([networkError, null])

      // Act & Assert
      await expect(bodyRepository.findByHash(hash)).rejects.toThrow(NetworkError)
      await expect(bodyRepository.findByHash(hash)).rejects.toThrow('Body not found')
    })
  })

  describe('findByID', () => {
    it('should find a body by ID successfully', async () => {
      // Arrange
      const bodyId = 'test-body-id'
      const mockResponseData = {
        id: bodyId,
        userID: 'test-user-id',
        bookID: 'test-book-id',
        chapterID: 'test-chapter-id',
        content: 'Test content',
        hash: 'test-hash',
        createdAt: Date.now()
      }

      vi.mocked(mockHTTPClient.get).mockResolvedValue([undefined, mockResponseData])

      // Act
      const result = await bodyRepository.findByID(bodyId)

      // Assert
      expect(result).toBeInstanceOf(Body)
      expect(result.getId()).toBe(bodyId)
      expect(mockHTTPClient.get).toHaveBeenCalledWith(
        `/body/${bodyId}`,
        {},
        expect.any(Object) // BodyValidationSchema
      )
    })

    it('should throw error when body not found', async () => {
      // Arrange
      const bodyId = 'non-existent-id'
      const networkError = new NetworkError('Body not found')
      vi.mocked(mockHTTPClient.get).mockResolvedValue([networkError, null])

      // Act & Assert
      await expect(bodyRepository.findByID(bodyId)).rejects.toThrow(NetworkError)
      await expect(bodyRepository.findByID(bodyId)).rejects.toThrow('Body not found')
    })
  })

  describe('getAllByChapter', () => {
    it('should get all bodies for a chapter successfully', async () => {
      // Arrange
      const bookID = 'test-book-id'
      const chapterID = 'test-chapter-id'
      const mockResponseData = [
        {
          id: 'test-body-1',
          userID: 'test-user-id',
          bookID,
          chapterID,
          content: 'Test content 1',
          hash: 'test-hash-1',
          createdAt: Date.now()
        },
        {
          id: 'test-body-2',
          userID: 'test-user-id',
          bookID,
          chapterID,
          content: 'Test content 2',
          hash: 'test-hash-2',
          createdAt: Date.now() + 1000
        }
      ]

      vi.mocked(mockHTTPClient.get).mockResolvedValue([undefined, mockResponseData])

      // Act
      const result = await bodyRepository.getAllByChapter(bookID, chapterID)

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0]).toBeInstanceOf(Body)
      expect(result[1]).toBeInstanceOf(Body)
      expect(result[0].getId()).toBe('test-body-1')
      expect(result[1].getId()).toBe('test-body-2')
      expect(mockHTTPClient.get).toHaveBeenCalledWith(
        `/body?bookID=${bookID}&chapterID=${chapterID}`,
        {},
        expect.any(Object) // Array schema
      )
    })

    it('should return empty array when no bodies exist', async () => {
      // Arrange
      const bookID = 'test-book-id'
      const chapterID = 'test-chapter-id'
      const mockResponseData: any[] = []

      vi.mocked(mockHTTPClient.get).mockResolvedValue([undefined, mockResponseData])

      // Act
      const result = await bodyRepository.getAllByChapter(bookID, chapterID)

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should throw error when chapter not found', async () => {
      // Arrange
      const bookID = 'non-existent-book'
      const chapterID = 'non-existent-chapter'
      const networkError = new NetworkError('Chapter not found')
      vi.mocked(mockHTTPClient.get).mockResolvedValue([networkError, null])

      // Act & Assert
      await expect(bodyRepository.getAllByChapter(bookID, chapterID)).rejects.toThrow(NetworkError)
      await expect(bodyRepository.getAllByChapter(bookID, chapterID)).rejects.toThrow('Chapter not found')
    })
  })
})
