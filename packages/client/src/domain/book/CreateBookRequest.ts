import { z } from 'zod'
import { ValueObject } from '../_kernel/types'
import type { components } from '../../generated/api-types'

type CreateBookRequestSchema = components['schemas']['CreateBookRequest']

export const CreateBookRequestValidationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  summary: z.string().max(1000)
})

export class CreateBookRequest extends ValueObject<CreateBookRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly summary: string
  ) {
    super({ id, title, summary })
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

  hasValidTitle(): boolean {
    return this.title.trim().length > 0 && this.title.length <= 200
  }

  hasValidSummary(): boolean {
    return this.summary.length <= 1000
  }

  isReadyToCreate(): boolean {
    return this.hasValidTitle() && this.hasValidSummary()
  }

  getWordCount(): number {
    return this.summary.split(/\s+/).filter(word => word.length > 0).length
  }

  getTitleWordCount(): number {
    return this.title.split(/\s+/).filter(word => word.length > 0).length
  }

  validate(): { isValid: boolean; errors: string[] } {
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

    return { isValid: errors.length === 0, errors }
  }

  static create(data: Omit<CreateBookRequestSchema, 'id'>): CreateBookRequest {
    const id = crypto.randomUUID()
    return CreateBookRequest.fromAPI({ ...data, id })
  }

  static fromAPI(data: CreateBookRequestSchema): CreateBookRequest {
    const validated = CreateBookRequestValidationSchema.parse(data)
    return new CreateBookRequest(
      validated.id,
      validated.title,
      validated.summary
    )
  }

  toAPI(): CreateBookRequestSchema {
    return this.getValue()
  }
}