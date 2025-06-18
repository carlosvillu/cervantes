import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {Entity} from '../_kernel/types'

type BookSchema = components['schemas']['Book']

export const BookValidationSchema = z.object({
  id: z.string().min(1),
  userID: z.string().min(1),
  title: z.string().min(1).max(200),
  summary: z.string().max(1000),
  published: z.boolean(),
  rootChapterID: z.string().nullable().optional(),
  createdAt: z.number(),
  updatedAt: z.number()
})

export class Book extends Entity<string> {
  constructor(
    id: string,
    private readonly userID: string,
    private readonly title: string,
    private readonly summary: string,
    private readonly published: boolean,
    private readonly rootChapterID: string | null | undefined,
    private readonly createdAt: number,
    private readonly updatedAt: number
  ) {
    super(id)
  }

  getUserID(): string {
    return this.userID
  }

  getTitle(): string {
    return this.title
  }

  getSummary(): string {
    return this.summary
  }

  isPublished(): boolean {
    return this.published
  }

  getRootChapterID(): string | null | undefined {
    return this.rootChapterID
  }

  getCreatedAt(): number {
    return this.createdAt
  }

  getUpdatedAt(): number {
    return this.updatedAt
  }

  hasRootChapter(): boolean {
    return this.rootChapterID !== null && this.rootChapterID !== undefined
  }

  belongsToUser(userID: string): boolean {
    return this.userID === userID
  }

  canBePublished(): boolean {
    return this.hasValidStructure() && this.hasRootChapter()
  }

  hasValidStructure(): boolean {
    return this.title.trim().length > 0 && this.summary.trim().length > 0
  }

  isDraft(): boolean {
    return !this.published
  }

  canBeEdited(): boolean {
    return this.isDraft()
  }

  canBeDeleted(): boolean {
    return true // Books can always be deleted by their owner
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

  getStatus(): BookStatus {
    if (this.published) return 'published'
    if (this.hasRootChapter()) return 'ready_to_publish'
    if (this.hasValidStructure()) return 'draft'
    return 'incomplete'
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

  static fromAPI(data: BookSchema): Book {
    const validated = BookValidationSchema.parse(data)
    return new Book(
      validated.id,
      validated.userID,
      validated.title,
      validated.summary,
      validated.published,
      validated.rootChapterID,
      validated.createdAt,
      validated.updatedAt
    )
  }

  toAPI(): BookSchema {
    return {
      id: this.getId(),
      userID: this.userID,
      title: this.title,
      summary: this.summary,
      published: this.published,
      rootChapterID: this.rootChapterID,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}

export type BookStatus = 'incomplete' | 'draft' | 'ready_to_publish' | 'published'
