/**
 * TokenManager - Advanced token management and storage
 *
 * This class handles authentication state management, token storage,
 * and automatic token refresh logic. It acts as a centralized manager
 * for all authentication-related state in the client.
 */

import type {AuthTokens} from '../../domain/auth/AuthTokens.js'
import {AuthTokens as AuthTokensModel} from '../../domain/auth/AuthTokens.js'

export interface TokenStorage {
  setItem: (key: string, value: string) => Promise<void> | void
  getItem: (key: string) => Promise<string | null> | string | null
  removeItem: (key: string) => Promise<void> | void
}

export interface TokenManagerConfig {
  storage?: TokenStorage
  storagePrefix?: string
  autoRefresh?: boolean
  refreshThresholdMs?: number
}

export enum AuthState {
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
  REFRESHING = 'refreshing',
  EXPIRED = 'expired'
}

export interface AuthStateChangeEvent {
  previousState: AuthState
  currentState: AuthState
  tokens?: AuthTokens
  error?: Error
}

export type AuthStateChangeListener = (event: AuthStateChangeEvent) => void

export class TokenManager {
  private tokens: AuthTokens | null = null
  private currentState: AuthState = AuthState.UNAUTHENTICATED
  private refreshPromise: Promise<AuthTokens> | null = null
  private refreshTimeoutId: NodeJS.Timeout | null = null
  private readonly listeners: Set<AuthStateChangeListener> = new Set()

  private readonly storage: TokenStorage
  private readonly storagePrefix: string
  private readonly autoRefresh: boolean
  private readonly refreshThresholdMs: number

  constructor(config: TokenManagerConfig = {}) {
    this.storage = config.storage ?? this.createDefaultStorage()
    this.storagePrefix = config.storagePrefix ?? 'cervantes_auth_'
    this.autoRefresh = config.autoRefresh ?? true
    this.refreshThresholdMs = config.refreshThresholdMs ?? 5 * 60 * 1000 // 5 minutes

    // Load tokens from storage on initialization
    void this.loadTokensFromStorage()
  }

  /**
   * Set authentication tokens and update state
   */
  async setTokens(tokens: AuthTokens): Promise<void> {
    const previousState = this.currentState
    this.tokens = tokens
    this.currentState = AuthState.AUTHENTICATED

    // Store tokens in persistent storage
    await this.storeTokensInStorage(tokens)

    // Schedule auto-refresh if enabled
    if (this.autoRefresh) {
      this.scheduleTokenRefresh()
    }

    // Notify state change
    this.notifyStateChange(previousState, this.currentState, tokens)
  }

  /**
   * Get current authentication tokens
   */
  getTokens(): AuthTokens | null {
    return this.tokens
  }

  /**
   * Get current authentication state
   */
  getState(): AuthState {
    return this.currentState
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentState === AuthState.AUTHENTICATED && this.tokens !== null
  }

  /**
   * Check if tokens need refresh
   */
  needsRefresh(): boolean {
    if (!this.tokens) return false
    return this.tokens.needsRefresh()
  }

  /**
   * Clear authentication tokens and state
   */
  async clearTokens(): Promise<void> {
    const previousState = this.currentState
    this.tokens = null
    this.currentState = AuthState.UNAUTHENTICATED

    // Clear tokens from storage
    await this.clearTokensFromStorage()

    // Cancel any pending refresh
    this.cancelTokenRefresh()

    // Notify state change
    this.notifyStateChange(previousState, this.currentState)
  }

  /**
   * Refresh tokens using provided refresh function
   */
  async refreshTokens(refreshFn: (refreshToken: string) => Promise<AuthTokens>): Promise<AuthTokens> {
    // Return existing refresh promise if already refreshing
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    if (!this.tokens) {
      throw new Error('No tokens available for refresh')
    }

    const previousState = this.currentState
    this.currentState = AuthState.REFRESHING
    this.notifyStateChange(previousState, this.currentState)

    this.refreshPromise = this.executeRefresh(refreshFn)

    try {
      const newTokens = await this.refreshPromise
      await this.setTokens(newTokens)
      return newTokens
    } catch (error) {
      // Handle refresh failure
      const errorState = AuthState.EXPIRED
      this.currentState = errorState
      await this.clearTokensFromStorage()
      this.notifyStateChange(AuthState.REFRESHING, errorState, undefined, error as Error)
      throw error
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * Add state change listener
   */
  addStateChangeListener(listener: AuthStateChangeListener): void {
    this.listeners.add(listener)
  }

  /**
   * Remove state change listener
   */
  removeStateChangeListener(listener: AuthStateChangeListener): void {
    this.listeners.delete(listener)
  }

  /**
   * Dispose of the token manager and cleanup resources
   */
  dispose(): void {
    this.cancelTokenRefresh()
    this.listeners.clear()
    this.refreshPromise = null
    this.tokens = null
    this.currentState = AuthState.UNAUTHENTICATED
  }

  private async executeRefresh(refreshFn: (refreshToken: string) => Promise<AuthTokens>): Promise<AuthTokens> {
    if (!this.tokens) {
      throw new Error('No refresh token available')
    }

    return refreshFn(this.tokens.getRefreshToken())
  }

  private scheduleTokenRefresh(): void {
    this.cancelTokenRefresh()

    if (!this.tokens || !this.autoRefresh) return

    // Simple implementation - check if tokens are going to expire soon
    const timeUntilRefresh = this.refreshThresholdMs

    if (timeUntilRefresh > 0) {
      this.refreshTimeoutId = setTimeout(() => {
        // This would trigger auto-refresh logic if implemented
        // For now, we just emit an event that tokens need refresh
        this.notifyStateChange(this.currentState, AuthState.EXPIRED)
      }, timeUntilRefresh)
    }
  }

  private cancelTokenRefresh(): void {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId)
      this.refreshTimeoutId = null
    }
  }

  private notifyStateChange(
    previousState: AuthState,
    currentState: AuthState,
    tokens?: AuthTokens,
    error?: Error
  ): void {
    const event: AuthStateChangeEvent = {
      previousState,
      currentState,
      tokens,
      error
    }

    this.listeners.forEach(listener => {
      try {
        listener(event)
      } catch (listenerError) {
        console.error('Error in auth state change listener:', listenerError) // eslint-disable-line no-console
      }
    })
  }

  private async loadTokensFromStorage(): Promise<void> {
    try {
      const storedTokens = await this.storage.getItem(`${this.storagePrefix}tokens`)
      if (storedTokens) {
        const tokenData = JSON.parse(storedTokens)
        const tokens = AuthTokensModel.fromAPI(tokenData)

        // Check if tokens are still valid
        if (tokens.isValid()) {
          this.tokens = tokens
          this.currentState = AuthState.AUTHENTICATED

          if (this.autoRefresh) {
            this.scheduleTokenRefresh()
          }
        } else {
          // Clear expired tokens
          await this.clearTokensFromStorage()
        }
      }
    } catch (error) {
      console.error('Error loading tokens from storage:', error) // eslint-disable-line no-console
      await this.clearTokensFromStorage()
    }
  }

  private async storeTokensInStorage(tokens: AuthTokens): Promise<void> {
    try {
      const tokenData = JSON.stringify(tokens.toAPI())
      await this.storage.setItem(`${this.storagePrefix}tokens`, tokenData)
    } catch (error) {
      console.error('Error storing tokens:', error) // eslint-disable-line no-console
    }
  }

  private async clearTokensFromStorage(): Promise<void> {
    try {
      await this.storage.removeItem(`${this.storagePrefix}tokens`)
    } catch (error) {
      console.error('Error clearing tokens from storage:', error) // eslint-disable-line no-console
    }
  }

  private createDefaultStorage(): TokenStorage {
    // Default to in-memory storage (fallback)
    const memoryStorage = new Map<string, string>()

    return {
      setItem: (key: string, value: string) => {
        memoryStorage.set(key, value)
      },
      getItem: (key: string) => {
        return memoryStorage.get(key) ?? null
      },
      removeItem: (key: string) => {
        memoryStorage.delete(key)
      }
    }
  }
}
