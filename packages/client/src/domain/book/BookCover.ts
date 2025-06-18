import { z } from 'zod'
import { Entity } from '../_kernel/types'
import type { components } from '../../generated/api-types'

type BookCoverSchema = components['schemas']['BookCover']

export const BookCoverValidationSchema = z.object({
  id: z.string().min(1),
  bookID: z.string().min(1),
  key: z.string().min(1)
})

export class BookCover extends Entity<string> {
  constructor(
    id: string,
    private readonly bookID: string,
    private readonly key: string
  ) {
    super(id)
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

  getImageURL(baseURL: string = ''): string {
    // Construct S3 URL or CDN URL from the key
    return `${baseURL}/images/${this.key}`
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

  isValidImageFormat(): boolean {
    const validFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    const extension = this.key.split('.').pop()?.toLowerCase()
    return extension ? validFormats.includes(extension) : false
  }

  getFileName(): string {
    return this.key.split('/').pop() || this.key
  }

  isAIGenerated(): boolean {
    // Check if the key contains AI generation indicators
    return this.key.includes('/ai-generated/') || this.key.includes('_ai_')
  }

  canBeDeleted(): boolean {
    return true // Book covers can always be deleted
  }

  canBeReplaced(): boolean {
    return true // Book covers can always be replaced
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isValidImageFormat()) {
      errors.push('Image format must be JPG, PNG, WebP, or GIF')
    }

    if (this.key.length === 0) {
      errors.push('Image key is required')
    }

    return { isValid: errors.length === 0, errors }
  }

  static fromAPI(data: BookCoverSchema): BookCover {
    const validated = BookCoverValidationSchema.parse(data)
    return new BookCover(
      validated.id,
      validated.bookID,
      validated.key
    )
  }

  toAPI(): BookCoverSchema {
    return {
      id: this.getId(),
      bookID: this.bookID,
      key: this.key
    }
  }
}