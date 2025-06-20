/**
 * SessionStorageAdapter - Browser SessionStorage implementation of TokenStorage
 *
 * This adapter provides temporary storage using the browser's sessionStorage API.
 * Data stored with this adapter will only persist for the current browser session.
 */

import type {TokenStorage} from '../../application/auth/TokenManager.js'

export class SessionStorageAdapter implements TokenStorage {
  constructor(private readonly isAvailable: boolean = SessionStorageAdapter.checkAvailability()) {}

  setItem(key: string, value: string): void {
    if (!this.isAvailable) {
      throw new Error('SessionStorage is not available in this environment')
    }

    try {
      sessionStorage.setItem(key, value)
    } catch (error) {
      throw new Error(
        `Failed to store item in sessionStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  getItem(key: string): string | null {
    if (!this.isAvailable) {
      return null
    }

    try {
      return sessionStorage.getItem(key)
    } catch (error) {
      console.error('Failed to retrieve item from sessionStorage:', error) // eslint-disable-line no-console
      return null
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable) {
      return
    }

    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove item from sessionStorage:', error) // eslint-disable-line no-console
    }
  }

  /**
   * Check if sessionStorage is available in the current environment
   */
  static checkAvailability(): boolean {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
        return false
      }

      // Test that we can actually use sessionStorage
      const testKey = '__cervantes_test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
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
