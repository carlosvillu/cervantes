import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {ValueObject} from '../_kernel/types'

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
