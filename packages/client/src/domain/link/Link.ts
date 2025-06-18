import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {Entity} from '../_kernel/types'

type LinkSchema = components['schemas']['Link']

export const LinkValidationSchema = z.object({
  id: z.string().min(1),
  userID: z.string().min(1),
  bookID: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  kind: z.enum(['options', 'direct']),
  body: z.string(),
  createdAt: z.number()
})

export class Link extends Entity<string> {
  constructor(
    id: string,
    private readonly userID: string,
    private readonly bookID: string,
    private readonly from: string,
    private readonly to: string,
    private readonly kind: LinkKind,
    private readonly body: string,
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

  getFrom(): string {
    return this.from
  }

  getTo(): string {
    return this.to
  }

  getKind(): LinkKind {
    return this.kind
  }

  getBody(): string {
    return this.body
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

  connectsChapter(chapterID: string): boolean {
    return this.from === chapterID || this.to === chapterID
  }

  isDirectLink(): boolean {
    return this.kind === 'direct'
  }

  isOptionsLink(): boolean {
    return this.kind === 'options'
  }

  hasDescription(): boolean {
    return this.body.trim().length > 0
  }

  isSelfReference(): boolean {
    return this.from === this.to
  }

  canBeDeleted(): boolean {
    return true
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (this.isSelfReference()) {
      errors.push('Link cannot reference itself')
    }

    if (!['options', 'direct'].includes(this.kind)) {
      errors.push('Link kind must be options or direct')
    }

    return {isValid: errors.length === 0, errors}
  }

  static fromAPI(data: LinkSchema): Link {
    const validated = LinkValidationSchema.parse(data)
    return new Link(
      validated.id,
      validated.userID,
      validated.bookID,
      validated.from,
      validated.to,
      validated.kind as LinkKind,
      validated.body,
      validated.createdAt
    )
  }

  toAPI(): LinkSchema {
    return {
      id: this.getId(),
      userID: this.userID,
      bookID: this.bookID,
      from: this.from,
      to: this.to,
      kind: this.kind,
      body: this.body,
      createdAt: this.createdAt
    }
  }
}

export type LinkKind = 'options' | 'direct'
