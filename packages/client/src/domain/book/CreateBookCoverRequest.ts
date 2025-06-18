import { z } from 'zod'
import { ValueObject } from '../_kernel/types'
import type { components } from '../../generated/api-types'

type CreateBookCoverRequestSchema = components['schemas']['CreateBookCoverRequest']

export const CreateBookCoverRequestValidationSchema = z.object({
  id: z.string().min(1),
  bookID: z.string().min(1),
  key: z.string().min(1)
})

export class CreateBookCoverRequest extends ValueObject<CreateBookCoverRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly bookID: string,
    private readonly key: string
  ) {
    super({ id, bookID, key })
  }

  getId(): string {
    return this.id
  }

  getBookID(): string {
    return this.bookID
  }

  getKey(): string {
    return this.key
  }

  belongsToBook(bookID: string): boolean {
    return this.bookID === bookID
  }

  isValidImageKey(): boolean {
    // Check if key follows S3 key pattern and has valid image extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    const extension = this.key.split('.').pop()?.toLowerCase()
    return extension ? validExtensions.includes(extension) : false
  }

  getImageFormat(): string | null {
    const extension = this.key.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'webp':
        return 'image/webp'
      case 'gif':
        return 'image/gif'
      default:
        return null
    }
  }

  getFileName(): string {
    return this.key.split('/').pop() || this.key
  }

  isFromUpload(): boolean {
    return this.key.includes('/uploads/')
  }

  isAIGenerated(): boolean {
    return this.key.includes('/ai-generated/') || this.key.includes('_ai_')
  }

  hasValidStructure(): boolean {
    return this.key.length > 0 && this.bookID.length > 0
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isValidImageKey()) {
      errors.push('Key must point to a valid image file (JPG, PNG, WebP, or GIF)')
    }

    if (!this.hasValidStructure()) {
      errors.push('Book ID and key are required')
    }

    if (this.key.length === 0) {
      errors.push('Image key cannot be empty')
    }

    if (this.bookID.length === 0) {
      errors.push('Book ID cannot be empty')
    }

    return { isValid: errors.length === 0, errors }
  }

  static create(data: Omit<CreateBookCoverRequestSchema, 'id'>): CreateBookCoverRequest {
    const id = crypto.randomUUID()
    return CreateBookCoverRequest.fromAPI({ ...data, id })
  }

  static fromAPI(data: CreateBookCoverRequestSchema): CreateBookCoverRequest {
    const validated = CreateBookCoverRequestValidationSchema.parse(data)
    return new CreateBookCoverRequest(
      validated.id,
      validated.bookID,
      validated.key
    )
  }

  toAPI(): CreateBookCoverRequestSchema {
    return this.getValue()
  }
}