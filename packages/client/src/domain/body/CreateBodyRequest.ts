import {z} from 'zod'

import type {components} from '../../generated/api-types.js'
import {ValueObject} from '../_kernel/types.js'

type CreateBodyRequestSchema = components['schemas']['CreateBodyRequest']

export const CreateBodyRequestValidationSchema = z.object({
  id: z.string().min(1),
  bookID: z.string().min(1),
  userID: z.string().min(1),
  chapterID: z.string().min(1),
  content: z.string()
})

export class CreateBodyRequest extends ValueObject<CreateBodyRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly bookID: string,
    private readonly userID: string,
    private readonly chapterID: string,
    private readonly content: string
  ) {
    super({id, bookID, userID, chapterID, content})
  }

  getId(): string {
    return this.id
  }

  getBookID(): string {
    return this.bookID
  }

  getUserID(): string {
    return this.userID
  }

  getChapterID(): string {
    return this.chapterID
  }

  getContent(): string {
    return this.content
  }

  hasValidContent(): boolean {
    return this.content.length >= 0 // Content can be empty for drafts
  }

  getWordCount(): number {
    return this.content.split(/\s+/).filter(word => word.length > 0).length
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (!this.bookID?.trim()) {
      errors.push('Book ID is required')
    }

    if (!this.userID?.trim()) {
      errors.push('User ID is required')
    }

    if (!this.chapterID?.trim()) {
      errors.push('Chapter ID is required')
    }

    if (this.content === undefined || this.content === null) {
      errors.push('Content is required')
    }

    // Validate UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (this.bookID && !uuidPattern.test(this.bookID)) {
      errors.push('Book ID must be a valid UUID')
    }

    if (this.userID && !uuidPattern.test(this.userID)) {
      errors.push('User ID must be a valid UUID')
    }

    if (this.chapterID && !uuidPattern.test(this.chapterID)) {
      errors.push('Chapter ID must be a valid UUID')
    }

    if (this.id && !uuidPattern.test(this.id)) {
      errors.push('Body ID must be a valid UUID')
    }

    return {isValid: errors.length === 0, errors}
  }

  static create(data: Omit<CreateBodyRequestSchema, 'id'>): CreateBodyRequest {
    const id = crypto.randomUUID()
    return CreateBodyRequest.fromAPI({...data, id})
  }

  static fromAPI(data: CreateBodyRequestSchema): CreateBodyRequest {
    const validated = CreateBodyRequestValidationSchema.parse(data)
    return new CreateBodyRequest(
      validated.id,
      validated.bookID,
      validated.userID,
      validated.chapterID,
      validated.content
    )
  }

  toAPI(): CreateBodyRequestSchema {
    return this.getValue()
  }
}
