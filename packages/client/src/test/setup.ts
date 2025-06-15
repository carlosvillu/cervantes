/**
 * Vitest setup file for @cervantes/client
 * 
 * This file is executed before any test files and can be used to:
 * - Configure global test environment
 * - Setup mocks and stubs
 * - Initialize test utilities
 */

// Global test configuration
import { beforeEach, vi } from 'vitest'

// Mock console methods in test environment to reduce noise
const originalConsole = console

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks()
  
  // Optionally suppress console.log in tests (uncomment if needed)
  // console.log = vi.fn()
  // console.warn = vi.fn()
  // console.error = vi.fn()
})

// Global test utilities can be added here
declare global {
  // Add any global test types or utilities here
}