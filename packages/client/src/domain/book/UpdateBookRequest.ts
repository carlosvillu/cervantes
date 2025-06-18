import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {ValueObject} from '../_kernel/types'

type UpdateBookRequestSchema = components['schemas']['UpdateBookRequest']

export const UpdateBookRequestValidationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  summary: z.string().max(1000),
  published: z.boolean(),
  createdAt: z.number()
})

export class UpdateBookRequest extends ValueObject<UpdateBookRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly summary: string,
    private readonly published: boolean,
    private readonly createdAt: number
  ) {
    super({id, title, summary, published, createdAt})
  }

  getId(): string {
    return this.id
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

  getCreatedAt(): number {
    return this.createdAt
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

  isPublishingUpdate(): boolean {
    return this.published
  }

  isUnpublishingUpdate(): boolean {
    return !this.published
  }

  getWordCount(): number {
    return this.summary.split(/\s+/).filter(word => word.length > 0).length
  }

  getTitleWordCount(): number {
    return this.title.split(/\s+/).filter(word => word.length > 0).length
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

    if (this.title.trim().length === 0) {
      errors.push('Title cannot be empty')
    }

    if (this.createdAt > Date.now()) {
      errors.push('Created date cannot be in the future')
    }

    return {isValid: errors.length === 0, errors}
  }

  static fromAPI(data: UpdateBookRequestSchema): UpdateBookRequest {
    const validated = UpdateBookRequestValidationSchema.parse(data)
    return new UpdateBookRequest(
      validated.id,
      validated.title,
      validated.summary,
      validated.published,
      validated.createdAt
    )
  }

  toAPI(): UpdateBookRequestSchema {
    return this.getValue()
  }
}
