import {describe, expect, it} from 'vitest'

import {CervantesClient} from './CervantesClient.js'

describe('CervantesClient', () => {
  describe('constructor', () => {
    it('should create instance with default configuration', () => {
      const client = new CervantesClient()

      expect(client).toBeInstanceOf(CervantesClient)
      expect(client.isConfigured()).toBe(true)
    })

    it('should create instance with custom configuration', () => {
      const config = {
        baseURL: 'http://localhost:3000',
        apiKey: 'test-key',
        timeout: 5000,
        retries: 1,
        debug: true
      }

      const client = new CervantesClient(config)
      const clientConfig = client.getConfig()

      expect(clientConfig.baseURL).toBe(config.baseURL)
      expect(clientConfig.apiKey).toBe(config.apiKey)
      expect(clientConfig.timeout).toBe(config.timeout)
      expect(clientConfig.retries).toBe(config.retries)
      expect(clientConfig.debug).toBe(config.debug)
    })

    it('should merge partial config with defaults', () => {
      const client = new CervantesClient({
        baseURL: 'http://custom.url',
        debug: true
      })
      const config = client.getConfig()

      expect(config.baseURL).toBe('http://custom.url')
      expect(config.debug).toBe(true)
      expect(config.timeout).toBe(30000) // default
      expect(config.retries).toBe(3) // default
    })
  })

  describe('getVersion', () => {
    it('should return current version', () => {
      const client = new CervantesClient()
      expect(client.getVersion()).toBe('0.1.0')
    })
  })

  describe('isConfigured', () => {
    it('should return true when baseURL is provided', () => {
      const client = new CervantesClient({baseURL: 'http://test.com'})
      expect(client.isConfigured()).toBe(true)
    })

    it('should return true with default baseURL', () => {
      const client = new CervantesClient()
      expect(client.isConfigured()).toBe(true)
    })
  })

  describe('getConfig', () => {
    it('should return a copy of the configuration', () => {
      const client = new CervantesClient({debug: true})
      const config1 = client.getConfig()
      const config2 = client.getConfig()

      expect(config1).toEqual(config2)
      expect(config1).not.toBe(config2) // Different object references
    })
  })
})
