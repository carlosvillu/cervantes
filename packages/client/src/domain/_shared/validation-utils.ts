/**
 * Shared validation utilities to avoid regex duplication across domain models
 */

// Cached regex patterns for performance
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,50}$/
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Password strength validation patterns
export const PASSWORD_PATTERNS = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBERS: /\d/,
  SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/
} as const

/**
 * Generates a UUID with fallback for environments where crypto.randomUUID() is not available
 */
export function generateUUID(): string {
  // Check if crypto.randomUUID is available (modern browsers and Node.js 14.17+)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c): string {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const ValidationUtils = {
  isValidEmail: (email: string): boolean => EMAIL_REGEX.test(email),
  isValidUsername: (username: string): boolean => USERNAME_REGEX.test(username),
  isValidUUID: (uuid: string): boolean => UUID_REGEX.test(uuid),
  isStrongPassword: (password: string): boolean => {
    const hasMinLength = password.length >= 8
    const hasUpperCase = PASSWORD_PATTERNS.UPPERCASE.test(password)
    const hasLowerCase = PASSWORD_PATTERNS.LOWERCASE.test(password)
    const hasNumbers = PASSWORD_PATTERNS.NUMBERS.test(password)
    const hasSpecialChar = PASSWORD_PATTERNS.SPECIAL_CHARS.test(password)

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  }
}
