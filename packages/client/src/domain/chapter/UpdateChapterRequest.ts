import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {ValueObject} from '../_kernel/types'

type UpdateChapterRequestSchema = components['schemas']['UpdateChapterRequest']

export const UpdateChapterRequestValidationSchema = z.object({
  id: z.string().min(1),
  bookID: z.string().min(1),
  title: z.string().min(1).max(200),
  summary: z.string().max(1000),
  createdAt: z.union([z.string(), z.number()])
})

export class UpdateChapterRequest extends ValueObject<UpdateChapterRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly bookID: string,
    private readonly title: string,
    private readonly summary: string,
    private readonly createdAt: string | number
  ) {
    super({id, bookID, title, summary, createdAt})
  }

  getId(): string {
    return this.id
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

  getCreatedAt(): string | number {
    return this.createdAt
  }

  belongsToBook(bookID: string): boolean {
    return this.bookID === bookID
  }

  hasValidTitle(): boolean {
    return this.title.trim().length > 0 && this.title.length <= 200
  }

  hasValidSummary(): boolean {
    return this.summary.length <= 1000
  }

  isReadyToUpdate(): boolean {
    return this.hasValidTitle() && this.hasValidSummary()
  }

  hasSignificantChanges(originalTitle: string, originalSummary: string): boolean {
    return this.title !== originalTitle || this.summary !== originalSummary
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (!this.hasValidTitle()) {
      errors.push('Title must be between 1 and 200 characters')
    }

    if (!this.hasValidSummary()) {
      errors.push('Summary must be 1000 characters or less')
    }

    if (this.bookID.length === 0) {
      errors.push('Book ID is required')
    }

    return {isValid: errors.length === 0, errors}
  }

  static fromAPI(data: UpdateChapterRequestSchema): UpdateChapterRequest {
    const validated = UpdateChapterRequestValidationSchema.parse(data)
    return new UpdateChapterRequest(
      validated.id,
      validated.bookID,
      validated.title,
      validated.summary,
      validated.createdAt
    )
  }

  toAPI(): UpdateChapterRequestSchema {
    return this.getValue()
  }
}
