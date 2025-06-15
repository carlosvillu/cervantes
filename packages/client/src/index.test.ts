import { describe, it, expect } from 'vitest'
import { VERSION } from './index.js'

describe('@cervantes/client', () => {
  it('should export VERSION constant', () => {
    expect(VERSION).toBe('0.1.0')
  })

  it('should export VERSION as string', () => {
    expect(typeof VERSION).toBe('string')
  })
})