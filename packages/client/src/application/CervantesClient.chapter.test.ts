/**
 * CervantesClient Chapter Management Tests
 */

import {beforeEach, describe, expect, it} from 'vitest'

import {CervantesClient} from './CervantesClient.js'

describe('CervantesClient - Chapter Management', () => {
  let client: CervantesClient

  beforeEach(() => {
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
})
