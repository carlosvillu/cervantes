/**
 * ChapterService Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {Chapter} from '../../domain/chapter/Chapter.js'
import type {ChapterRepository} from '../../domain/chapter/ChapterRepository.js'
import {ChapterService} from './ChapterService.js'

describe('ChapterService', () => {
  let mockChapterRepository: ChapterRepository
  let chapterService: ChapterService

  beforeEach(() => {
    mockChapterRepository = {
      create: vi.fn(),
      findByID: vi.fn(),
      getAllByBookId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    chapterService = new ChapterService({repository: mockChapterRepository})
  })

  describe('createSimple', () => {
    it('should create a chapter with minimal input', async () => {
      // Arrange
      const mockCreatedChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440001',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test Chapter',
        summary: 'A test chapter summary',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      vi.mocked(mockChapterRepository.create).mockResolvedValue(mockCreatedChapter)

      // Act
      const result = await chapterService.createSimple(
        'Test Chapter',
        'A test chapter summary',
        '550e8400-e29b-41d4-a716-446655440000'
      )

      // Assert
      expect(result).toBe(mockCreatedChapter)
      expect(mockChapterRepository.create).toHaveBeenCalledOnce()
    })
  })

  describe('getChaptersByBookId', () => {
    it('should return chapters for a specific book', async () => {
      // Arrange
      const mockChapters = [
        Chapter.fromAPI({
          id: '550e8400-e29b-41d4-a716-446655440011',
          userID: '550e8400-e29b-41d4-a716-446655440002',
          bookID: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Chapter 1',
          summary: 'First chapter',
          createdAt: Date.now() - 2000,
          updatedAt: Date.now() - 2000
        }),
        Chapter.fromAPI({
          id: '550e8400-e29b-41d4-a716-446655440012',
          userID: '550e8400-e29b-41d4-a716-446655440002',
          bookID: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Chapter 2',
          summary: 'Second chapter',
          createdAt: Date.now() - 1000,
          updatedAt: Date.now() - 1000
        })
      ]

      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue(mockChapters)

      // Act
      const result = await chapterService.getChaptersByBookId('550e8400-e29b-41d4-a716-446655440000')

      // Assert
      expect(result).toEqual(mockChapters)
      expect(mockChapterRepository.getAllByBookId).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000')
    })
  })

  describe('getChapterById', () => {
    it('should return a specific chapter by ID', async () => {
      // Arrange
      const mockChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440001',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test Chapter',
        summary: 'A test chapter summary',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      vi.mocked(mockChapterRepository.findByID).mockResolvedValue(mockChapter)

      // Act
      const result = await chapterService.getChapterById('550e8400-e29b-41d4-a716-446655440001')

      // Assert
      expect(result).toBe(mockChapter)
      expect(mockChapterRepository.findByID).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001')
    })
  })

  describe('updateBasicInfo', () => {
    it('should update chapter title and summary', async () => {
      // Arrange
      const mockCurrentChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440001',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Original Chapter Title',
        summary: 'Original chapter summary',
        createdAt: Date.now() - 5000,
        updatedAt: Date.now() - 1000
      })

      const mockUpdatedChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440001',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Updated Chapter Title',
        summary: 'Updated chapter summary',
        createdAt: Date.now() - 5000,
        updatedAt: Date.now()
      })

      vi.mocked(mockChapterRepository.findByID).mockResolvedValue(mockCurrentChapter)
      vi.mocked(mockChapterRepository.update).mockResolvedValue(mockUpdatedChapter)

      // Act
      const result = await chapterService.updateBasicInfo(
        '550e8400-e29b-41d4-a716-446655440001',
        'Updated Chapter Title',
        'Updated chapter summary'
      )

      // Assert
      expect(result).toBe(mockUpdatedChapter)
      expect(mockChapterRepository.findByID).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001')
      expect(mockChapterRepository.update).toHaveBeenCalledOnce()
    })
  })

  describe('deleteChapterById', () => {
    it('should delete a chapter by ID', async () => {
      // Arrange
      vi.mocked(mockChapterRepository.delete).mockResolvedValue()

      // Act
      await chapterService.deleteChapterById('550e8400-e29b-41d4-a716-446655440001')

      // Assert
      expect(mockChapterRepository.delete).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001')
    })
  })

  describe('getChapterCountForBook', () => {
    it('should return the correct count of chapters for a book', async () => {
      // Arrange
      const mockChapters = [
        Chapter.fromAPI({
          id: '550e8400-e29b-41d4-a716-446655440011',
          userID: '550e8400-e29b-41d4-a716-446655440002',
          bookID: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Chapter 1',
          summary: 'First chapter',
          createdAt: Date.now() - 2000,
          updatedAt: Date.now() - 2000
        }),
        Chapter.fromAPI({
          id: '550e8400-e29b-41d4-a716-446655440012',
          userID: '550e8400-e29b-41d4-a716-446655440002',
          bookID: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Chapter 2',
          summary: 'Second chapter',
          createdAt: Date.now() - 1000,
          updatedAt: Date.now() - 1000
        }),
        Chapter.fromAPI({
          id: '550e8400-e29b-41d4-a716-446655440013',
          userID: '550e8400-e29b-41d4-a716-446655440002',
          bookID: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Chapter 3',
          summary: 'Third chapter',
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
      ]

      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue(mockChapters)

      // Act
      const result = await chapterService.getChapterCountForBook('550e8400-e29b-41d4-a716-446655440000')

      // Assert
      expect(result).toBe(3)
      expect(mockChapterRepository.getAllByBookId).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000')
    })

    it('should return 0 for a book with no chapters', async () => {
      // Arrange
      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue([])

      // Act
      const result = await chapterService.getChapterCountForBook('550e8400-e29b-41d4-a716-446655440000')

      // Assert
      expect(result).toBe(0)
    })
  })

  describe('getMostRecentChapterForBook', () => {
    it('should return the most recently updated chapter', async () => {
      // Arrange
      const now = Date.now()
      const oldChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440011',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Old Chapter',
        summary: 'Old chapter',
        createdAt: now - 3000,
        updatedAt: now - 2000
      })
      const recentChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440012',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Recent Chapter',
        summary: 'Recent chapter',
        createdAt: now - 1000,
        updatedAt: now - 500
      })
      const middleChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440013',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Middle Chapter',
        summary: 'Middle chapter',
        createdAt: now - 2000,
        updatedAt: now - 1000
      })

      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue([oldChapter, recentChapter, middleChapter])

      // Act
      const result = await chapterService.getMostRecentChapterForBook('550e8400-e29b-41d4-a716-446655440000')

      // Assert
      expect(result).toBe(recentChapter)
      expect(result?.getId()).toBe('550e8400-e29b-41d4-a716-446655440012')
    })

    it('should return null for a book with no chapters', async () => {
      // Arrange
      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue([])

      // Act
      const result = await chapterService.getMostRecentChapterForBook('550e8400-e29b-41d4-a716-446655440000')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('getChaptersSortedByDate', () => {
    it('should return chapters sorted by creation date in ascending order', async () => {
      // Arrange
      const now = Date.now()
      const chapter1 = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440011',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Chapter 1',
        summary: 'First chapter',
        createdAt: now - 3000,
        updatedAt: now - 3000
      })
      const chapter2 = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440012',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Chapter 2',
        summary: 'Second chapter',
        createdAt: now - 2000,
        updatedAt: now - 2000
      })
      const chapter3 = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440013',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Chapter 3',
        summary: 'Third chapter',
        createdAt: now - 1000,
        updatedAt: now - 1000
      })

      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue([chapter3, chapter1, chapter2])

      // Act
      const result = await chapterService.getChaptersSortedByDate('550e8400-e29b-41d4-a716-446655440000', true)

      // Assert
      expect(result).toEqual([chapter1, chapter2, chapter3])
    })

    it('should return chapters sorted by creation date in descending order', async () => {
      // Arrange
      const now = Date.now()
      const chapter1 = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440011',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Chapter 1',
        summary: 'First chapter',
        createdAt: now - 3000,
        updatedAt: now - 3000
      })
      const chapter2 = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440012',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Chapter 2',
        summary: 'Second chapter',
        createdAt: now - 2000,
        updatedAt: now - 2000
      })
      const chapter3 = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440013',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Chapter 3',
        summary: 'Third chapter',
        createdAt: now - 1000,
        updatedAt: now - 1000
      })

      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue([chapter1, chapter2, chapter3])

      // Act
      const result = await chapterService.getChaptersSortedByDate('550e8400-e29b-41d4-a716-446655440000', false)

      // Assert
      expect(result).toEqual([chapter3, chapter2, chapter1])
    })
  })

  describe('getChaptersSortedByTitle', () => {
    it('should return chapters sorted by title in ascending order', async () => {
      // Arrange
      const chapterB = Chapter.fromAPI({
        id: 'chapter-b',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'B Chapter',
        summary: 'B chapter',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
      const chapterA = Chapter.fromAPI({
        id: 'chapter-a',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'A Chapter',
        summary: 'A chapter',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
      const chapterC = Chapter.fromAPI({
        id: 'chapter-c',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'C Chapter',
        summary: 'C chapter',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue([chapterB, chapterC, chapterA])

      // Act
      const result = await chapterService.getChaptersSortedByTitle('550e8400-e29b-41d4-a716-446655440000', true)

      // Assert
      expect(result).toEqual([chapterA, chapterB, chapterC])
    })

    it('should return chapters sorted by title in descending order', async () => {
      // Arrange
      const chapterB = Chapter.fromAPI({
        id: 'chapter-b',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'B Chapter',
        summary: 'B chapter',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
      const chapterA = Chapter.fromAPI({
        id: 'chapter-a',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'A Chapter',
        summary: 'A chapter',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
      const chapterC = Chapter.fromAPI({
        id: 'chapter-c',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'C Chapter',
        summary: 'C chapter',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue([chapterA, chapterB, chapterC])

      // Act
      const result = await chapterService.getChaptersSortedByTitle('550e8400-e29b-41d4-a716-446655440000', false)

      // Assert
      expect(result).toEqual([chapterC, chapterB, chapterA])
    })
  })

  describe('create', () => {
    it('should create a chapter using the repository', async () => {
      // Arrange
      const mockCreatedChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440001',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test Chapter',
        summary: 'A test chapter summary',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      vi.mocked(mockChapterRepository.create).mockResolvedValue(mockCreatedChapter)

      const input = {
        title: 'Test Chapter',
        summary: 'A test chapter summary',
        bookID: '550e8400-e29b-41d4-a716-446655440000'
      }

      // Act
      const result = await chapterService.create(input)

      // Assert
      expect(result).toBe(mockCreatedChapter)
      expect(mockChapterRepository.create).toHaveBeenCalledOnce()
    })
  })

  describe('findByID', () => {
    it('should find a chapter by ID using the repository', async () => {
      // Arrange
      const mockChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440001',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test Chapter',
        summary: 'A test chapter summary',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      vi.mocked(mockChapterRepository.findByID).mockResolvedValue(mockChapter)

      const input = {id: '550e8400-e29b-41d4-a716-446655440001'}

      // Act
      const result = await chapterService.findByID(input)

      // Assert
      expect(result).toBe(mockChapter)
      expect(mockChapterRepository.findByID).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001')
    })
  })

  describe('getAllByBookId', () => {
    it('should get all chapters for a book using the repository', async () => {
      // Arrange
      const mockChapters = [
        Chapter.fromAPI({
          id: '550e8400-e29b-41d4-a716-446655440011',
          userID: '550e8400-e29b-41d4-a716-446655440002',
          bookID: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Chapter 1',
          summary: 'First chapter',
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
      ]

      vi.mocked(mockChapterRepository.getAllByBookId).mockResolvedValue(mockChapters)

      const input = {bookId: '550e8400-e29b-41d4-a716-446655440000'}

      // Act
      const result = await chapterService.getAllByBookId(input)

      // Assert
      expect(result).toEqual(mockChapters)
      expect(mockChapterRepository.getAllByBookId).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000')
    })
  })

  describe('update', () => {
    it('should update a chapter using the repository', async () => {
      // Arrange
      const mockUpdatedChapter = Chapter.fromAPI({
        id: '550e8400-e29b-41d4-a716-446655440001',
        userID: '550e8400-e29b-41d4-a716-446655440002',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Updated Chapter',
        summary: 'Updated summary',
        createdAt: Date.now() - 5000,
        updatedAt: Date.now()
      })

      vi.mocked(mockChapterRepository.update).mockResolvedValue(mockUpdatedChapter)

      const input = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Updated Chapter',
        summary: 'Updated summary',
        bookID: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: Date.now() - 5000
      }

      // Act
      const result = await chapterService.update(input)

      // Assert
      expect(result).toBe(mockUpdatedChapter)
      expect(mockChapterRepository.update).toHaveBeenCalledOnce()
    })
  })

  describe('delete', () => {
    it('should delete a chapter using the repository', async () => {
      // Arrange
      vi.mocked(mockChapterRepository.delete).mockResolvedValue()

      const input = {id: '550e8400-e29b-41d4-a716-446655440001'}

      // Act
      await chapterService.delete(input)

      // Assert
      expect(mockChapterRepository.delete).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001')
    })
  })
})
