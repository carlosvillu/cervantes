import {z} from 'zod'

import type {components} from '../../generated/api-types.js'
import {ValueObject} from '../_kernel/types.js'

type SuccessMessageSchema = components['schemas']['SuccessMessage']

export const SuccessMessageValidationSchema = z.object({
  message: z.string()
})

export class SuccessMessage extends ValueObject<SuccessMessageSchema> {
  constructor(private readonly message: string) {
    super({message})
  }

  getMessage(): string {
    return this.message
  }

  static fromAPI(data: SuccessMessageSchema): SuccessMessage {
    const validated = SuccessMessageValidationSchema.parse(data)
    return new SuccessMessage(validated.message)
  }

  toAPI(): SuccessMessageSchema {
    return this.getValue()
  }
}
