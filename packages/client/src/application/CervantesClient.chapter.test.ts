/**
 * CervantesClient Chapter Management Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {CervantesClient} from './CervantesClient.js'

describe('CervantesClient - Chapter Management', () => {
  let client: CervantesClient

  beforeEach(() => {
    vi.clearAllMocks()
    client = new CervantesClient({
      baseURL: 'http://localhost:3000',
      debug: false
    })
  })

  describe('Chapter Service Integration', () => {
    it('should have a chapter service available', () => {
      const chapterService = client.getChapterService()
      expect(chapterService).toBeDefined()
    })
  })

  describe('Chapter Management Methods', () => {
    it('should have createChapter method', () => {
      expect(typeof client.createChapter).toBe('function')
    })

    it('should have findChapterByID method', () => {
      expect(typeof client.findChapterByID).toBe('function')
    })

    it('should have getAllChaptersByBookId method', () => {
      expect(typeof client.getAllChaptersByBookId).toBe('function')
    })

    it('should have updateChapter method', () => {
      expect(typeof client.updateChapter).toBe('function')
    })

    it('should have deleteChapter method', () => {
      expect(typeof client.deleteChapter).toBe('function')
    })

    it('should have createSimpleChapter method', () => {
      expect(typeof client.createSimpleChapter).toBe('function')
    })

    it('should have updateChapterBasicInfo method', () => {
      expect(typeof client.updateChapterBasicInfo).toBe('function')
    })

    it('should have getChaptersByBookId method', () => {
      expect(typeof client.getChaptersByBookId).toBe('function')
    })

    it('should have getChapterById method', () => {
      expect(typeof client.getChapterById).toBe('function')
    })

    it('should have deleteChapterById method', () => {
      expect(typeof client.deleteChapterById).toBe('function')
    })

    it('should have getChapterCountForBook method', () => {
      expect(typeof client.getChapterCountForBook).toBe('function')
    })

    it('should have getMostRecentChapterForBook method', () => {
      expect(typeof client.getMostRecentChapterForBook).toBe('function')
    })

    it('should have getChaptersSortedByDate method', () => {
      expect(typeof client.getChaptersSortedByDate).toBe('function')
    })

    it('should have getChaptersSortedByTitle method', () => {
      expect(typeof client.getChaptersSortedByTitle).toBe('function')
    })
  })

  describe('Input Validation', () => {
    it('should validate chapter creation input', async () => {
      await expect(
        client.createChapter({
          title: '',
          summary: 'Valid summary',
          bookID: '550e8400-e29b-41d4-a716-446655440000'
        })
      ).rejects.toThrow('Title is required')
    })

    it('should validate chapter creation summary', async () => {
      await expect(
        client.createChapter({
          title: 'Valid title',
          summary: '',
          bookID: '550e8400-e29b-41d4-a716-446655440000'
        })
      ).rejects.toThrow('Summary is required')
    })

    it('should validate book ID format in creation', async () => {
      await expect(
        client.createChapter({
          title: 'Valid title',
          summary: 'Valid summary',
          bookID: 'invalid-uuid'
        })
      ).rejects.toThrow('Book ID must be a valid UUID')
    })

    it('should validate chapter update input', async () => {
      await expect(
        client.updateChapter({
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: '',
          summary: 'Valid summary',
          bookID: '550e8400-e29b-41d4-a716-446655440000',
          createdAt: Date.now()
        })
      ).rejects.toThrow('Title is required')
    })

    it('should validate chapter ID format in update', async () => {
      await expect(
        client.updateChapter({
          id: 'invalid-uuid',
          title: 'Valid title',
          summary: 'Valid summary',
          bookID: '550e8400-e29b-41d4-a716-446655440000',
          createdAt: Date.now()
        })
      ).rejects.toThrow('Chapter ID must be a valid UUID')
    })

    it('should validate find chapter by ID input', async () => {
      await expect(client.findChapterByID({id: 'invalid-uuid'})).rejects.toThrow('Chapter ID must be a valid UUID')
    })

    it('should validate get all chapters by book ID input', async () => {
      await expect(client.getAllChaptersByBookId({bookId: 'invalid-uuid'})).rejects.toThrow(
        'Book ID must be a valid UUID'
      )
    })

    it('should validate delete chapter input', async () => {
      await expect(client.deleteChapter({id: 'invalid-uuid'})).rejects.toThrow('Chapter ID must be a valid UUID')
    })
  })
})
