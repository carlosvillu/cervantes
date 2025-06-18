import {describe, expect, it} from 'vitest'

import {AuthTokens} from './auth/AuthTokens'
import {Book} from './book/Book'
import {User} from './user/User'

describe('Domain Models', () => {
  it('should create User model from API data', () => {
    const userData = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: '[REDACTED]',
      verified: true
    }

    const user = User.fromAPI(userData)

    expect(user.getId()).toBe('1')
    expect(user.getUsername()).toBe('testuser')
    expect(user.isVerified()).toBe(true)
    expect(user.canCreateBooks()).toBe(true)
  })

  it('should create Book model with business logic', () => {
    const bookData = {
      id: '1',
      userID: 'user1',
      title: 'Test Book',
      summary: 'A test book',
      published: false,
      rootChapterID: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    const book = Book.fromAPI(bookData)

    expect(book.getTitle()).toBe('Test Book')
    expect(book.isDraft()).toBe(true)
    expect(book.canBePublished()).toBe(false) // No root chapter
    expect(book.hasValidStructure()).toBe(true)
  })

  it('should validate auth tokens', () => {
    const tokenData = {
      access: 'access-token',
      refresh: 'refresh-token'
    }

    const tokens = AuthTokens.fromAPI(tokenData)

    expect(tokens.getAccessToken()).toBe('access-token')
    expect(tokens.getRefreshToken()).toBe('refresh-token')
  })
})
