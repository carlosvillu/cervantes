/**
 * CervantesClient Body Integration Tests
 */

import {beforeEach, describe, expect, it} from 'vitest'

import {CervantesClient} from './CervantesClient.js'

describe('CervantesClient - Body Integration', () => {
  let client: CervantesClient

  beforeEach(() => {
    client = new CervantesClient({
      baseURL: 'http://localhost:3000',
      debug: false
    })
  })

  describe('Body Management Methods', () => {
    it('should have createBody method', () => {
      expect(typeof client.createBody).toBe('function')
    })

    it('should have createSimpleBody method', () => {
      expect(typeof client.createSimpleBody).toBe('function')
    })

    it('should have findBodyByHash method', () => {
      expect(typeof client.findBodyByHash).toBe('function')
    })

    it('should have findBodyByID method', () => {
      expect(typeof client.findBodyByID).toBe('function')
    })

    it('should have getAllBodiesByChapter method', () => {
      expect(typeof client.getAllBodiesByChapter).toBe('function')
    })

    it('should have getBodyService method', () => {
      expect(typeof client.getBodyService).toBe('function')
    })
  })

  describe('getBodyService', () => {
    it('should return the body service instance', () => {
      // Act
      const bodyService = client.getBodyService()

      // Assert
      expect(bodyService).toBeDefined()
      expect(typeof bodyService.create).toBe('function')
      expect(typeof bodyService.findByHash).toBe('function')
      expect(typeof bodyService.findByID).toBe('function')
      expect(typeof bodyService.getAllByChapter).toBe('function')
    })
  })
})
