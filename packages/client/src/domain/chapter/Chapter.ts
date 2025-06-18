import {z} from 'zod'

import type {components} from '../../generated/api-types.js'
import {Entity} from '../_kernel/types.js'

type ChapterSchema = components['schemas']['Chapter']

export const ChapterValidationSchema = z.object({
  id: z.string().min(1),
  userID: z.string().min(1),
  bookID: z.string().min(1),
  title: z.string().min(1).max(200),
  summary: z.string().max(1000),
  createdAt: z.number(),
  updatedAt: z.number()
})

export class Chapter extends Entity<string> {
  constructor(
    id: string,
    private readonly userID: string,
    private readonly bookID: string,
    private readonly title: string,
    private readonly summary: string,
    private readonly createdAt: number,
    private readonly updatedAt: number
  ) {
    super(id)
  }

  getUserID(): string {
    return this.userID
  }

  getBookID(): string {
    return this.bookID
  }

  getTitle(): string {
    return this.title
  }

  getSummary(): string {
    return this.summary
  }

  getCreatedAt(): number {
    return this.createdAt
  }

  getUpdatedAt(): number {
    return this.updatedAt
  }

  belongsToUser(userID: string): boolean {
    return this.userID === userID
  }

  belongsToBook(bookID: string): boolean {
    return this.bookID === bookID
  }

  hasValidStructure(): boolean {
    return this.title.trim().length > 0 && this.summary.trim().length >= 0
  }

  canBeDeleted(): boolean {
    return true // Chapters can be deleted if not referenced by links
  }

  canBeEdited(): boolean {
    return true // Chapters can always be edited by their owner
  }

  getAge(): number {
    return Date.now() - this.createdAt
  }

  isRecent(): boolean {
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000
    return this.getAge() < ONE_WEEK
  }

  wasRecentlyUpdated(): boolean {
    const ONE_DAY = 24 * 60 * 60 * 1000
    return Date.now() - this.updatedAt < ONE_DAY
  }

  getWordCount(): number {
    return this.summary.split(/\s+/).filter(word => word.length > 0).length
  }

  getTitleWordCount(): number {
    return this.title.split(/\s+/).filter(word => word.length > 0).length
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (this.title.trim().length === 0) {
      errors.push('Title is required')
    }

    if (this.title.length > 200) {
      errors.push('Title must be 200 characters or less')
    }

    if (this.summary.length > 1000) {
      errors.push('Summary must be 1000 characters or less')
    }

    return {isValid: errors.length === 0, errors}
  }

  static fromAPI(data: ChapterSchema): Chapter {
    const validated = ChapterValidationSchema.parse(data)
    return new Chapter(
      validated.id,
      validated.userID,
      validated.bookID,
      validated.title,
      validated.summary,
      validated.createdAt,
      validated.updatedAt
    )
  }

  toAPI(): ChapterSchema {
    return {
      id: this.getId(),
      userID: this.userID,
      bookID: this.bookID,
      title: this.title,
      summary: this.summary,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
