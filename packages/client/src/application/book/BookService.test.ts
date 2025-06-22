/**
 * BookService Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Book} from '../../domain/book/Book.js'
import type {BookRepository} from '../../domain/book/BookRepository.js'
import {BookService} from './BookService.js'

describe('BookService', () => {
  let mockBookRepository: BookRepository
  let bookService: BookService

  beforeEach(() => {
    mockBookRepository = {
      create: vi.fn(),
      findByID: vi.fn(),
      getAll: vi.fn(),
      update: vi.fn()
    }
    bookService = new BookService({repository: mockBookRepository})
  })

  describe('createSimple', () => {
    it('should create a book with minimal input', async () => {
      // Arrange
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
      const result = await bookService.createSimple('Test Book', 'A test book summary')

      // Assert
      expect(result).toBe(mockCreatedBook)
      expect(mockBookRepository.create).toHaveBeenCalledOnce()
    })
  })

  describe('togglePublished', () => {
    it('should toggle published status from false to true', async () => {
      // Arrange
      const currentBook = Book.fromAPI({
        id: 'test-book-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: false,
        rootChapterID: null,
        createdAt: 1700000000000,
        updatedAt: Date.now()
      })

      const updatedBook = Book.fromAPI({
        id: 'test-book-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: true,
        rootChapterID: null,
        createdAt: 1700000000000,
        updatedAt: Date.now()
      })

      vi.mocked(mockBookRepository.findByID).mockResolvedValue(currentBook)
      vi.mocked(mockBookRepository.update).mockResolvedValue(updatedBook)

      // Act
      const result = await bookService.togglePublished('test-book-id')

      // Assert
      expect(result).toBe(updatedBook)
      expect(mockBookRepository.findByID).toHaveBeenCalledWith('test-book-id')
      expect(mockBookRepository.update).toHaveBeenCalledWith('test-book-id', expect.any(Object))
    })

    it('should toggle published status from true to false', async () => {
      // Arrange
      const currentBook = Book.fromAPI({
        id: 'test-book-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: true,
        rootChapterID: null,
        createdAt: 1700000000000,
        updatedAt: Date.now()
      })

      const updatedBook = Book.fromAPI({
        id: 'test-book-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: false,
        rootChapterID: null,
        createdAt: 1700000000000,
        updatedAt: Date.now()
      })

      vi.mocked(mockBookRepository.findByID).mockResolvedValue(currentBook)
      vi.mocked(mockBookRepository.update).mockResolvedValue(updatedBook)

      // Act
      const result = await bookService.togglePublished('test-book-id')

      // Assert
      expect(result).toBe(updatedBook)
      expect(result.isPublished()).toBe(false)
    })
  })

  describe('publish', () => {
    it('should publish an unpublished book', async () => {
      // Arrange
      const currentBook = Book.fromAPI({
        id: 'test-book-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: false,
        rootChapterID: null,
        createdAt: 1700000000000,
        updatedAt: Date.now()
      })

      const publishedBook = Book.fromAPI({
        id: 'test-book-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: true,
        rootChapterID: null,
        createdAt: 1700000000000,
        updatedAt: Date.now()
      })

      vi.mocked(mockBookRepository.findByID).mockResolvedValue(currentBook)
      vi.mocked(mockBookRepository.update).mockResolvedValue(publishedBook)

      // Act
      const result = await bookService.publish('test-book-id')

      // Assert
      expect(result).toBe(publishedBook)
      expect(result.isPublished()).toBe(true)
    })

    it('should return the same book if already published', async () => {
      // Arrange
      const currentBook = Book.fromAPI({
        id: 'test-book-id',
        userID: 'test-user-id',
        title: 'Test Book',
        summary: 'A test book summary',
        published: true,
        rootChapterID: null,
        createdAt: 1700000000000,
        updatedAt: Date.now()
      })

      vi.mocked(mockBookRepository.findByID).mockResolvedValue(currentBook)

      // Act
      const result = await bookService.publish('test-book-id')

      // Assert
      expect(result).toBe(currentBook)
      expect(mockBookRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('getAll', () => {
    it('should get all books from repository', async () => {
      // Arrange
      const mockBooks = [
        Book.fromAPI({
          id: 'book1',
          userID: 'test-user-id',
          title: 'Book 1',
          summary: 'Summary 1',
          published: false,
          rootChapterID: null,
          createdAt: 1700000000000,
          updatedAt: 1700000001000
        }),
        Book.fromAPI({
          id: 'book2',
          userID: 'test-user-id',
          title: 'Book 2',
          summary: 'Summary 2',
          published: true,
          rootChapterID: null,
          createdAt: 1700000000000,
          updatedAt: 1700000002000
        })
      ]

      vi.mocked(mockBookRepository.getAll).mockResolvedValue(mockBooks)

      // Act
      const result = await bookService.getAll()

      // Assert
      expect(result).toEqual(mockBooks)
      expect(mockBookRepository.getAll).toHaveBeenCalledOnce()
    })
  })
})
