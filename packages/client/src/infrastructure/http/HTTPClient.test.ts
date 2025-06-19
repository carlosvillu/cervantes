import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {z} from 'zod'

import {AuthenticationError, NetworkError, ServerError, ValidationError} from './errors/index.js'
import {HTTPClientImpl} from './HTTPClient.js'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('HTTPClient', () => {
  let httpClient: HTTPClientImpl
  const mockConfig = {
    baseURL: 'https://api.example.com',
    apiKey: 'test-key',
    timeout: 5000,
    retries: 3,
    debug: false
  }

  beforeEach(() => {
    httpClient = new HTTPClientImpl(mockConfig)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      expect(httpClient).toBeInstanceOf(HTTPClientImpl)
    })
  })

  describe('successful requests', () => {
    it('should make successful GET request', async () => {
      const mockData = {message: 'success'}
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockData),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      const [error, data] = await httpClient.get('/test')

      expect(error).toBeUndefined()
      expect(data).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should make successful POST request with body', async () => {
      const requestBody = {name: 'test'}
      const mockData = {id: 1}
      const mockResponse = {
        ok: true,
        status: 201,
        json: vi.fn().mockResolvedValue(mockData),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      const [error, data] = await httpClient.post('/test', {body: requestBody})

      expect(error).toBeUndefined()
      expect(data).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody)
        })
      )
    })
  })

  describe('schema validation', () => {
    it('should validate response with schema', async () => {
      const mockData = {message: 'success', count: 42}
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockData),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      const schema = z.object({
        message: z.string(),
        count: z.number()
      })

      const [error, data] = await httpClient.get('/test', {}, schema)

      expect(error).toBeUndefined()
      expect(data).toEqual(mockData)
    })

    it('should return validation error for invalid schema', async () => {
      const mockData = {message: 'success', count: 'invalid'}
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockData),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      const schema = z.object({
        message: z.string(),
        count: z.number()
      })

      const [error, data] = await httpClient.get('/test', {}, schema)

      expect(error).toBeInstanceOf(ValidationError)
      expect(data).toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('should handle 401 authentication error', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({}),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      const [error, data] = await httpClient.get('/test')

      expect(error).toBeInstanceOf(AuthenticationError)
      expect(data).toBeUndefined()
      expect((error as AuthenticationError).statusCode).toBe(401)
    })

    it('should handle 400 validation error', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({}),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      const [error, data] = await httpClient.get('/test')

      expect(error).toBeInstanceOf(ValidationError)
      expect(data).toBeUndefined()
    })

    it('should handle 500 server error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({}),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      const [error, data] = await httpClient.get('/test')

      expect(error).toBeInstanceOf(ServerError)
      expect(data).toBeUndefined()
      expect((error as ServerError).statusCode).toBe(500)
    })

    it('should handle network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const [error, data] = await httpClient.get('/test')

      expect(error).toBeInstanceOf(NetworkError)
      expect(data).toBeUndefined()
    })
  })

  describe('auth token management', () => {
    it('should set and clear auth tokens', () => {
      expect(httpClient.hasValidTokens()).toBe(false)

      httpClient.setAuthTokens('access-token', 'refresh-token')
      expect(httpClient.hasValidTokens()).toBe(true)

      httpClient.clearAuthTokens()
      expect(httpClient.hasValidTokens()).toBe(false)
    })

    it('should include auth header when tokens are set', async () => {
      httpClient.setAuthTokens('access-token', 'refresh-token')

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({}),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      await httpClient.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token'
          })
        })
      )
    })
  })

  describe('URL building', () => {
    it('should build full URL from relative path', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({}),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      await httpClient.get('/test')
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', expect.any(Object))

      await httpClient.get('test')
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', expect.any(Object))
    })

    it('should use absolute URL as is', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({}),
        clone: vi.fn().mockReturnThis()
      }
      mockFetch.mockResolvedValue(mockResponse)

      await httpClient.get('https://other-api.com/test')
      expect(mockFetch).toHaveBeenCalledWith('https://other-api.com/test', expect.any(Object))
    })
  })
})
