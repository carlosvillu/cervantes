import {z} from 'zod'

import type {components} from '../../generated/api-types.js'
import {ValueObject} from '../_kernel/types.js'
import {generateUUID} from '../_shared/validation-utils.js'

type CreateChapterCoverRequestSchema = components['schemas']['CreateChapterCoverRequest']

export const CreateChapterCoverRequestValidationSchema = z.object({
  id: z.string().min(1),
  bookID: z.string().min(1),
  chapterID: z.string().min(1),
  key: z.string().min(1)
})

export class CreateChapterCoverRequest extends ValueObject<CreateChapterCoverRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly bookID: string,
    private readonly chapterID: string,
    private readonly key: string
  ) {
    super({id, bookID, chapterID, key})
  }

  getId(): string {
    return this.id
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

  isValidImageKey(): boolean {
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    const extension = this.key.split('.').pop()?.toLowerCase()
    return extension ? validExtensions.includes(extension) : false
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (!this.isValidImageKey()) {
      errors.push('Key must point to a valid image file')
    }

    if (this.bookID.length === 0) {
      errors.push('Book ID is required')
    }

    if (this.chapterID.length === 0) {
      errors.push('Chapter ID is required')
    }

    return {isValid: errors.length === 0, errors}
  }

  static create(data: Omit<CreateChapterCoverRequestSchema, 'id'>): CreateChapterCoverRequest {
    const id = generateUUID()
    return CreateChapterCoverRequest.fromAPI({...data, id})
  }

  static fromAPI(data: CreateChapterCoverRequestSchema): CreateChapterCoverRequest {
    const validated = CreateChapterCoverRequestValidationSchema.parse(data)
    return new CreateChapterCoverRequest(validated.id, validated.bookID, validated.chapterID, validated.key)
  }

  toAPI(): CreateChapterCoverRequestSchema {
    return this.getValue()
  }
}
