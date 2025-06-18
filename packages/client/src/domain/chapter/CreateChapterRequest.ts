import {z} from 'zod'

import type {components} from '../../generated/api-types.js'
import {ValueObject} from '../_kernel/types.js'

type CreateChapterRequestSchema = components['schemas']['CreateChapterRequest']

export const CreateChapterRequestValidationSchema = z.object({
  id: z.string().min(1),
  bookID: z.string().min(1),
  title: z.string().min(1).max(200),
  summary: z.string().max(1000)
})

export class CreateChapterRequest extends ValueObject<CreateChapterRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly bookID: string,
    private readonly title: string,
    private readonly summary: string
  ) {
    super({id, bookID, title, summary})
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

  belongsToBook(bookID: string): boolean {
    return this.bookID === bookID
  }

  hasValidTitle(): boolean {
    return this.title.trim().length > 0 && this.title.length <= 200
  }

  hasValidSummary(): boolean {
    return this.summary.length <= 1000
  }

  isReadyToCreate(): boolean {
    return this.hasValidTitle() && this.hasValidSummary()
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

  static create(data: Omit<CreateChapterRequestSchema, 'id'>): CreateChapterRequest {
    const id = crypto.randomUUID()
    return CreateChapterRequest.fromAPI({...data, id})
  }

  static fromAPI(data: CreateChapterRequestSchema): CreateChapterRequest {
    const validated = CreateChapterRequestValidationSchema.parse(data)
    return new CreateChapterRequest(validated.id, validated.bookID, validated.title, validated.summary)
  }

  toAPI(): CreateChapterRequestSchema {
    return this.getValue()
  }
}
