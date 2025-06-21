import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {AuthTokens} from '../../domain/auth/AuthTokens.js'
import {type TokenStorage, AuthState, TokenManager} from './TokenManager.js'

// Helper function to create AuthTokens for testing
function createTestAuthTokens(access: string, refresh: string): AuthTokens {
  return AuthTokens.fromAPI({access, refresh})
}

describe('TokenManager', () => {
  let mockStorage: TokenStorage
  let tokenManager: TokenManager

  beforeEach(() => {
    mockStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn()
    }

    tokenManager = new TokenManager({
      storage: mockStorage,
      storagePrefix: 'test_',
      autoRefresh: false // Disable auto-refresh for testing
    })
  })

  afterEach(() => {
    tokenManager.dispose()
  })

  describe('constructor', () => {
    it('should initialize with unauthenticated state', () => {
      expect(tokenManager.getState()).toBe(AuthState.UNAUTHENTICATED)
      expect(tokenManager.isAuthenticated()).toBe(false)
      expect(tokenManager.getTokens()).toBeNull()
    })

    it('should use default storage when none provided', () => {
      const defaultTokenManager = new TokenManager()
      expect(defaultTokenManager.getState()).toBe(AuthState.UNAUTHENTICATED)
      defaultTokenManager.dispose()
    })
  })

  describe('setTokens', () => {
    it('should set tokens and update state to authenticated', async () => {
      // Arrange
      const tokens = createTestAuthTokens('access-token', 'refresh-token')

      // Act
      await tokenManager.setTokens(tokens)

      // Assert
      expect(tokenManager.getState()).toBe(AuthState.AUTHENTICATED)
      expect(tokenManager.isAuthenticated()).toBe(true)
      expect(tokenManager.getTokens()).toBe(tokens)
      expect(mockStorage.setItem).toHaveBeenCalledWith('test_tokens', expect.stringContaining('access-token'))
    })

    it('should notify state change listeners', async () => {
      // Arrange
      const tokens = createTestAuthTokens('access-token', 'refresh-token')
      const listener = vi.fn()
      tokenManager.addStateChangeListener(listener)

      // Act
      await tokenManager.setTokens(tokens)

      // Assert
      expect(listener).toHaveBeenCalledWith({
        previousState: AuthState.UNAUTHENTICATED,
        currentState: AuthState.AUTHENTICATED,
        tokens,
        error: undefined
      })
    })
  })

  describe('clearTokens', () => {
    it('should clear tokens and update state to unauthenticated', async () => {
      // Arrange
      const tokens = createTestAuthTokens('access-token', 'refresh-token')
      await tokenManager.setTokens(tokens)

      // Act
      await tokenManager.clearTokens()

      // Assert
      expect(tokenManager.getState()).toBe(AuthState.UNAUTHENTICATED)
      expect(tokenManager.isAuthenticated()).toBe(false)
      expect(tokenManager.getTokens()).toBeNull()
      expect(mockStorage.removeItem).toHaveBeenCalledWith('test_tokens')
    })

    it('should notify state change listeners', async () => {
      // Arrange
      const tokens = createTestAuthTokens('access-token', 'refresh-token')
      await tokenManager.setTokens(tokens)

      const listener = vi.fn()
      tokenManager.addStateChangeListener(listener)

      // Act
      await tokenManager.clearTokens()

      // Assert
      expect(listener).toHaveBeenCalledWith({
        previousState: AuthState.AUTHENTICATED,
        currentState: AuthState.UNAUTHENTICATED,
        tokens: undefined,
        error: undefined
      })
    })
  })

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      // Arrange
      const originalTokens = createTestAuthTokens('old-access', 'refresh-token')
      const newTokens = createTestAuthTokens('new-access', 'new-refresh')
      await tokenManager.setTokens(originalTokens)

      const refreshFn = vi.fn().mockResolvedValue(newTokens)

      // Act
      const result = await tokenManager.refreshTokens(refreshFn)

      // Assert
      expect(result).toBe(newTokens)
      expect(tokenManager.getTokens()).toBe(newTokens)
      expect(refreshFn).toHaveBeenCalledWith('refresh-token')
    })

    it('should handle refresh errors and update state to expired', async () => {
      // Arrange
      const originalTokens = createTestAuthTokens('old-access', 'refresh-token')
      await tokenManager.setTokens(originalTokens)

      const refreshError = new Error('Refresh failed')
      const refreshFn = vi.fn().mockRejectedValue(refreshError)
      const listener = vi.fn()
      tokenManager.addStateChangeListener(listener)

      // Act & Assert
      await expect(tokenManager.refreshTokens(refreshFn)).rejects.toThrow('Refresh failed')
      expect(tokenManager.getState()).toBe(AuthState.EXPIRED)
      expect(listener).toHaveBeenCalledWith({
        previousState: AuthState.REFRESHING,
        currentState: AuthState.EXPIRED,
        tokens: undefined,
        error: refreshError
      })
    })

    it('should throw error when no tokens available', async () => {
      // Arrange
      const refreshFn = vi.fn()

      // Act & Assert
      await expect(tokenManager.refreshTokens(refreshFn)).rejects.toThrow('No tokens available for refresh')
      expect(refreshFn).not.toHaveBeenCalled()
    })

    it('should return existing refresh promise if already refreshing', async () => {
      // Arrange
      const originalTokens = createTestAuthTokens('old-access', 'refresh-token')
      const newTokens = createTestAuthTokens('new-access', 'new-refresh')
      await tokenManager.setTokens(originalTokens)

      const refreshFn = vi
        .fn()
        .mockImplementation(async () => new Promise(resolve => setTimeout(() => resolve(newTokens), 100)))

      // Act
      const promise1 = tokenManager.refreshTokens(refreshFn)
      const promise2 = tokenManager.refreshTokens(refreshFn)

      // Assert
      expect(promise1).toStrictEqual(promise2)
      expect(refreshFn).toHaveBeenCalledOnce()

      // Wait for promises to resolve
      await promise1
      await promise2
    })
  })

  describe('state change listeners', () => {
    it('should add and remove listeners correctly', async () => {
      // Arrange
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      // Act
      tokenManager.addStateChangeListener(listener1)
      tokenManager.addStateChangeListener(listener2)
      tokenManager.removeStateChangeListener(listener1)

      // Trigger a state change
      const tokens = createTestAuthTokens('access', 'refresh')
      await tokenManager.setTokens(tokens)

      // Assert
      expect(listener1).not.toHaveBeenCalled()
      expect(listener2).toHaveBeenCalled()
    })

    it('should handle listener errors gracefully', async () => {
      // Arrange
      const faultyListener = vi.fn().mockImplementation(() => {
        throw new Error('Listener error')
      })
      const goodListener = vi.fn()

      tokenManager.addStateChangeListener(faultyListener)
      tokenManager.addStateChangeListener(goodListener)

      // Mock console.error to verify error handling
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Act
      const tokens = createTestAuthTokens('access', 'refresh')
      await tokenManager.setTokens(tokens)

      // Assert
      expect(faultyListener).toHaveBeenCalled()
      expect(goodListener).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith('Error in auth state change listener:', expect.any(Error))

      // Cleanup
      consoleSpy.mockRestore()
    })
  })

  describe('dispose', () => {
    it('should cleanup all resources', () => {
      // Arrange
      const listener = vi.fn()
      tokenManager.addStateChangeListener(listener)

      // Act
      tokenManager.dispose()

      // Assert
      expect(tokenManager.getState()).toBe(AuthState.UNAUTHENTICATED)
      expect(tokenManager.getTokens()).toBeNull()

      // Listener should not be called after dispose
      const tokens = createTestAuthTokens('access', 'refresh')
      void tokenManager.setTokens(tokens)
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
