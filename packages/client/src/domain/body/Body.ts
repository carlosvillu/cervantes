import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {Entity} from '../_kernel/types'

type BodySchema = components['schemas']['Body']

export const BodyValidationSchema = z.object({
  id: z.string().min(1),
  userID: z.string().min(1),
  bookID: z.string().min(1),
  chapterID: z.string().min(1),
  content: z.string(),
  hash: z.string().min(1),
  createdAt: z.number()
})

export class Body extends Entity<string> {
  constructor(
    id: string,
    private readonly userID: string,
    private readonly bookID: string,
    private readonly chapterID: string,
    private readonly content: string,
    private readonly hash: string,
    private readonly createdAt: number
  ) {
    super(id)
  }

  getUserID(): string {
    return this.userID
  }

  getBookID(): string {
    return this.bookID
  }

  getChapterID(): string {
    return this.chapterID
  }

  getContent(): string {
    return this.content
  }

  getHash(): string {
    return this.hash
  }

  getCreatedAt(): number {
    return this.createdAt
  }

  belongsToUser(userID: string): boolean {
    return this.userID === userID
  }

  belongsToBook(bookID: string): boolean {
    return this.bookID === bookID
  }

  belongsToChapter(chapterID: string): boolean {
    return this.chapterID === chapterID
  }

  hasContent(): boolean {
    return this.content.trim().length > 0
  }

  getWordCount(): number {
    return this.content.split(/\s+/).filter(word => word.length > 0).length
  }

  getCharacterCount(): number {
    return this.content.length
  }

  isHashValid(): boolean {
    // Simple hash validation - in real implementation you'd compute the actual hash
    return this.hash.length > 0
  }

  static fromAPI(data: BodySchema): Body {
    const validated = BodyValidationSchema.parse(data)
    return new Body(
      validated.id,
      validated.userID,
      validated.bookID,
      validated.chapterID,
      validated.content,
      validated.hash,
      validated.createdAt
    )
  }

  toAPI(): BodySchema {
    return {
      id: this.getId(),
      userID: this.userID,
      bookID: this.bookID,
      chapterID: this.chapterID,
      content: this.content,
      hash: this.hash,
      createdAt: this.createdAt
    }
  }
}
