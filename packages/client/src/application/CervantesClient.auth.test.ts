/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {AuthTokens} from '../domain/auth/AuthTokens.js'
import {AuthState} from './auth/index.js'
import {CervantesClient} from './CervantesClient.js'

// Mock storage to avoid browser dependencies
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockStorage = {
  setItem: vi.fn(),
  getItem: vi.fn().mockReturnValue(null),
  removeItem: vi.fn()
}

// Mock fetch for HTTP requests
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('CervantesClient - Authentication Integration', () => {
  let client: CervantesClient

  beforeEach(() => {
    vi.clearAllMocks()

    client = new CervantesClient({
      baseURL: 'http://localhost:3000',
      debug: false
    })
  })

  afterEach(() => {
    client.dispose()
  })

  describe('signup', () => {
    it('should call signup use case with correct input', async () => {
      // Arrange
      const signupInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      }

      const mockResponse = {
        message: 'User created successfully'
      }

      const mockResponseObj: Response = {
        ok: true,
        status: 201,
        json: async () => Promise.resolve(mockResponse),
        clone: () =>
          ({
            json: async () => Promise.resolve(mockResponse)
          } as Response)
      } as Response
      mockFetch.mockResolvedValueOnce(mockResponseObj)

      // Act
      const result = await client.signup(signupInput)

      // Assert
      expect(result.getMessage()).toBe('User created successfully')
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/auth/signup',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('testuser')
        })
      )
    })
  })

  describe('login', () => {
    it('should authenticate user and update auth state', async () => {
      // Arrange
      const loginInput = {
        email: 'test@example.com',
        password: 'Password123!'
      }

      const mockTokenResponse = {
        access:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lkma0z6WOzgKd5L8KX8GlU_jn6Lk8VgUYZcKg_dE2rk',
        refresh:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.refresh-token-signature'
      }

      const mockLoginResponse: Response = {
        ok: true,
        status: 200,
        json: async () => Promise.resolve(mockTokenResponse),
        clone: () =>
          ({
            json: async () => Promise.resolve(mockTokenResponse)
          } as Response)
      } as Response
      mockFetch.mockResolvedValueOnce(mockLoginResponse)

      // Act
      const result = await client.login(loginInput)

      // Assert
      expect(result.getAccessToken()).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lkma0z6WOzgKd5L8KX8GlU_jn6Lk8VgUYZcKg_dE2rk'
      )
      expect(result.getRefreshToken()).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.refresh-token-signature'
      )
      expect(client.isAuthenticated()).toBe(true)
      expect(client.getAuthState()).toBe(AuthState.AUTHENTICATED)
      expect(client.getAccessToken()).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lkma0z6WOzgKd5L8KX8GlU_jn6Lk8VgUYZcKg_dE2rk'
      )
    })
  })

  describe('logout', () => {
    it('should logout user and clear auth state', async () => {
      // Arrange - First login
      const mockTokenResponse = {
        access:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lkma0z6WOzgKd5L8KX8GlU_jn6Lk8VgUYZcKg_dE2rk',
        refresh:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.refresh-token-signature'
      }

      const mockLoginResponse2: Response = {
        ok: true,
        status: 200,
        json: async () => Promise.resolve(mockTokenResponse),
        clone: () =>
          ({
            json: async () => Promise.resolve(mockTokenResponse)
          } as Response)
      } as Response

      const mockLogoutResponse: Response = {
        ok: true,
        status: 200,
        json: async () => Promise.resolve({message: 'Logged out successfully'}),
        clone: () =>
          ({
            json: async () => Promise.resolve({message: 'Logged out successfully'})
          } as Response)
      } as Response

      mockFetch.mockResolvedValueOnce(mockLoginResponse2).mockResolvedValueOnce(mockLogoutResponse)

      await client.login({
        email: 'test@example.com',
        password: 'Password123!'
      })

      // Act
      const result = await client.logout()

      // Assert
      expect(result.getMessage()).toBe('Logged out successfully')
      expect(client.isAuthenticated()).toBe(false)
      expect(client.getAuthState()).toBe(AuthState.UNAUTHENTICATED)
      expect(client.getAccessToken()).toBeNull()
    })
  })

  describe('auth state management', () => {
    it('should notify auth state changes', async () => {
      // Arrange
      const stateChangeListener = vi.fn()
      client.onAuthStateChange(stateChangeListener)

      const mockTokenResponse = {
        access:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lkma0z6WOzgKd5L8KX8GlU_jn6Lk8VgUYZcKg_dE2rk',
        refresh:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.refresh-token-signature'
      }

      const mockAuthStateResponse: Response = {
        ok: true,
        status: 200,
        json: async () => Promise.resolve(mockTokenResponse),
        clone: () =>
          ({
            json: async () => Promise.resolve(mockTokenResponse)
          } as Response)
      } as Response
      mockFetch.mockResolvedValueOnce(mockAuthStateResponse)

      // Act
      await client.login({
        email: 'test@example.com',
        password: 'Password123!'
      })

      // Assert
      expect(stateChangeListener).toHaveBeenCalledWith({
        previousState: AuthState.UNAUTHENTICATED,
        currentState: AuthState.AUTHENTICATED,
        tokens: expect.any(Object),
        error: undefined
      })
    })

    it('should remove auth state listeners', async () => {
      // Arrange
      const stateChangeListener = vi.fn()
      client.onAuthStateChange(stateChangeListener)
      client.offAuthStateChange(stateChangeListener)

      const mockTokenResponse = {
        access:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lkma0z6WOzgKd5L8KX8GlU_jn6Lk8VgUYZcKg_dE2rk',
        refresh:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.refresh-token-signature'
      }

      const mockRemoveListenerResponse: Response = {
        ok: true,
        status: 200,
        json: async () => Promise.resolve(mockTokenResponse),
        clone: () =>
          ({
            json: async () => Promise.resolve(mockTokenResponse)
          } as Response)
      } as Response
      mockFetch.mockResolvedValueOnce(mockRemoveListenerResponse)

      // Act
      await client.login({
        email: 'test@example.com',
        password: 'Password123!'
      })

      // Assert
      expect(stateChangeListener).not.toHaveBeenCalled()
    })
  })

  describe('token management', () => {
    it('should indicate when tokens need refresh', async () => {
      // Arrange - Login with valid tokens first
      const validTokenResponse = {
        access:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.valid-access-token',
        refresh:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.refresh-signature'
      }

      const mockValidTokenResponse: Response = {
        ok: true,
        status: 200,
        json: async () => Promise.resolve(validTokenResponse),
        clone: () =>
          ({
            json: async () => Promise.resolve(validTokenResponse)
          } as Response)
      } as Response
      mockFetch.mockResolvedValueOnce(mockValidTokenResponse)

      await client.login({
        email: 'test@example.com',
        password: 'Password123!'
      })

      // Now manually set expired tokens in the token manager
      const expired = Math.floor((Date.now() - 1000) / 1000) // 1 second ago (expired)
      const expiredAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
        JSON.stringify({exp: expired})
      )}.signature`
      const validRefreshToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.refresh-signature'

      // Use the internal auth service to set expired tokens
      const expiredTokens = new AuthTokens(expiredAccessToken, validRefreshToken)
      await (client as any).authService.tokenManager.setTokens(expiredTokens)

      // Act & Assert
      expect(client.needsRefresh()).toBe(true)
    })

    it('should handle token refresh', async () => {
      // Arrange - Login first
      const mockTokenResponse = {
        access:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.old-access-token',
        refresh:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.refresh-token'
      }

      const newTokenResponse = {
        access:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.new-access-token',
        refresh:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.new-refresh-token'
      }

      const mockOldTokenResponse: Response = {
        ok: true,
        status: 200,
        json: async () => Promise.resolve(mockTokenResponse),
        clone: () =>
          ({
            json: async () => Promise.resolve(mockTokenResponse)
          } as Response)
      } as Response

      const mockNewTokenResponse: Response = {
        ok: true,
        status: 200,
        json: async () => Promise.resolve(newTokenResponse),
        clone: () =>
          ({
            json: async () => Promise.resolve(newTokenResponse)
          } as Response)
      } as Response

      mockFetch.mockResolvedValueOnce(mockOldTokenResponse).mockResolvedValueOnce(mockNewTokenResponse)

      await client.login({
        email: 'test@example.com',
        password: 'Password123!'
      })

      // Act
      const newTokens = await client.refreshTokens()

      // Assert
      expect(newTokens.getAccessToken()).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.new-access-token'
      )
      expect(client.getAccessToken()).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.new-access-token'
      )
    })
  })

  describe('backward compatibility', () => {
    it('should support legacy token management methods', () => {
      // Act
      client.setAuthTokens('access-token', 'refresh-token')

      // Assert
      expect(client.hasValidTokens()).toBe(true)

      // Act
      client.clearAuthTokens()

      // Assert
      expect(client.hasValidTokens()).toBe(false)
    })
  })
})
