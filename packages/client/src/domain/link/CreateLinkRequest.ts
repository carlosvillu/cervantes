import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {ValueObject} from '../_kernel/types'

type CreateLinkRequestSchema = components['schemas']['CreateLinkRequest']

export const CreateLinkRequestValidationSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  kind: z.enum(['options', 'direct']),
  body: z.string(),
  bookID: z.string().min(1)
})

export class CreateLinkRequest extends ValueObject<CreateLinkRequestSchema> {
  constructor(
    private readonly id: string,
    private readonly from: string,
    private readonly to: string,
    private readonly kind: 'options' | 'direct',
    private readonly body: string,
    private readonly bookID: string
  ) {
    super({id, from, to, kind, body, bookID})
  }

  getId(): string {
    return this.id
  }

  getFrom(): string {
    return this.from
  }

  getTo(): string {
    return this.to
  }

  getKind(): 'options' | 'direct' {
    return this.kind
  }

  getBody(): string {
    return this.body
  }

  getBookID(): string {
    return this.bookID
  }

  isValidConnection(): boolean {
    return this.from !== this.to && this.from.length > 0 && this.to.length > 0
  }

  validate(): {isValid: boolean; errors: string[]} {
    const errors: string[] = []

    if (!this.isValidConnection()) {
      errors.push('From and to chapters must be different and valid')
    }

    return {isValid: errors.length === 0, errors}
  }

  static create(data: Omit<CreateLinkRequestSchema, 'id'>): CreateLinkRequest {
    const id = crypto.randomUUID()
    return CreateLinkRequest.fromAPI({...data, id})
  }

  static fromAPI(data: CreateLinkRequestSchema): CreateLinkRequest {
    const validated = CreateLinkRequestValidationSchema.parse(data)
    return new CreateLinkRequest(
      validated.id,
      validated.from,
      validated.to,
      validated.kind,
      validated.body,
      validated.bookID
    )
  }

  toAPI(): CreateLinkRequestSchema {
    return this.getValue()
  }
}
