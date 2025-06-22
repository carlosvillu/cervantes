/**
 * CervantesClient Book Integration Tests
 */

import {beforeEach, describe, expect, it} from 'vitest'

import {CervantesClient} from './CervantesClient.js'

describe('CervantesClient - Book Integration', () => {
  let client: CervantesClient

  beforeEach(() => {
    client = new CervantesClient({
      baseURL: 'http://localhost:3000',
      debug: false
    })
  })

  describe('Book Management Methods', () => {
    it('should have createBook method', () => {
      expect(typeof client.createBook).toBe('function')
    })

    it('should have findBookByID method', () => {
      expect(typeof client.findBookByID).toBe('function')
    })

    it('should have getAllBooks method', () => {
      expect(typeof client.getAllBooks).toBe('function')
    })

    it('should have updateBook method', () => {
      expect(typeof client.updateBook).toBe('function')
    })

    it('should have createSimpleBook method', () => {
      expect(typeof client.createSimpleBook).toBe('function')
    })

    it('should have updateBookBasicInfo method', () => {
      expect(typeof client.updateBookBasicInfo).toBe('function')
    })

    it('should have toggleBookPublished method', () => {
      expect(typeof client.toggleBookPublished).toBe('function')
    })

    it('should have publishBook method', () => {
      expect(typeof client.publishBook).toBe('function')
    })

    it('should have unpublishBook method', () => {
      expect(typeof client.unpublishBook).toBe('function')
    })

    it('should have getBookService method', () => {
      expect(typeof client.getBookService).toBe('function')
    })
  })

  describe('BookService Integration', () => {
    it('should provide access to BookService instance', () => {
      const bookService = client.getBookService()
      expect(bookService).toBeDefined()
      expect(typeof bookService.create).toBe('function')
      expect(typeof bookService.findByID).toBe('function')
      expect(typeof bookService.getAll).toBe('function')
      expect(typeof bookService.update).toBe('function')
    })
  })
})
