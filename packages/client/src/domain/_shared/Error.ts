import { z } from 'zod'
import { ValueObject } from '../_kernel/types'
import type { components } from '../../generated/api-types'

type ErrorSchema = components['schemas']['Error']

export const ErrorValidationSchema = z.object({
  error: z.boolean(),
  message: z.string()
})

export class ErrorResponse extends ValueObject<ErrorSchema> {
  constructor(
    private readonly error: boolean,
    private readonly message: string
  ) {
    super({ error, message })
  }

  isError(): boolean { return this.error }
  getMessage(): string { return this.message }

  static fromAPI(data: ErrorSchema): ErrorResponse {
    const validated = ErrorValidationSchema.parse(data)
    return new ErrorResponse(validated.error, validated.message)
  }

  toAPI(): ErrorSchema {
    return this.getValue()
  }
}