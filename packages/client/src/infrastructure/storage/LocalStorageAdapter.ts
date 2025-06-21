/**
 * LocalStorageAdapter - Browser LocalStorage implementation of TokenStorage
 *
 * This adapter provides persistent storage using the browser's localStorage API.
 * Data stored with this adapter will persist across browser sessions.
 */

import type {TokenStorage} from '../../application/auth/TokenManager.js'

export class LocalStorageAdapter implements TokenStorage {
  constructor(private readonly isAvailable: boolean = LocalStorageAdapter.checkAvailability()) {}

  setItem(key: string, value: string): void {
    if (!this.isAvailable) {
      throw new Error('LocalStorage is not available in this environment')
    }

    try {
      localStorage.setItem(key, value)
    } catch (error) {
      throw new Error(
        `Failed to store item in localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  getItem(key: string): string | null {
    if (!this.isAvailable) {
      return null
    }

    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Failed to retrieve item from localStorage:', error) // eslint-disable-line no-console
      return null
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable) {
      return
    }

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove item from localStorage:', error) // eslint-disable-line no-console
    }
  }

  /**
   * Check if localStorage is available in the current environment
   */
  static checkAvailability(): boolean {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false
      }

      // Test that we can actually use localStorage
      const testKey = '__cervantes_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get the storage availability status
   */
  isStorageAvailable(): boolean {
    return this.isAvailable
  }
}
