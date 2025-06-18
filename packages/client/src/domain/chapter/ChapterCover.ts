import { z } from 'zod'
import { Entity } from '../_kernel/types'
import type { components } from '../../generated/api-types'

type ChapterCoverSchema = components['schemas']['ChapterCover']

export const ChapterCoverValidationSchema = z.object({
  id: z.string().min(1),
  bookID: z.string().min(1),
  chapterID: z.string().min(1),
  key: z.string().min(1)
})

export class ChapterCover extends Entity<string> {
  constructor(
    id: string,
    private readonly bookID: string,
    private readonly chapterID: string,
    private readonly key: string
  ) {
    super(id)
  }

  getBookID(): string {
    return this.bookID
  }

  getChapterID(): string {
    return this.chapterID
  }

  getKey(): string {
    return this.key
  }

  belongsToBook(bookID: string): boolean {
    return this.bookID === bookID
  }

  belongsToChapter(chapterID: string): boolean {
    return this.chapterID === chapterID
  }

  getImageURL(baseURL: string = ''): string {
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
    return this.key.includes('/ai-generated/') || this.key.includes('_ai_')
  }

  canBeDeleted(): boolean {
    return true
  }

  canBeReplaced(): boolean {
    return true
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

  static fromAPI(data: ChapterCoverSchema): ChapterCover {
    const validated = ChapterCoverValidationSchema.parse(data)
    return new ChapterCover(
      validated.id,
      validated.bookID,
      validated.chapterID,
      validated.key
    )
  }

  toAPI(): ChapterCoverSchema {
    return {
      id: this.getId(),
      bookID: this.bookID,
      chapterID: this.chapterID,
      key: this.key
    }
  }
}