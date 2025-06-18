import { z } from 'zod'
import { ValueObject } from '../_kernel/types'
import type { components } from '../../generated/api-types'

type UploadImageResponseSchema = components['schemas']['UploadImageResponse']

export const UploadImageResponseValidationSchema = z.object({
  key: z.string().min(1)
})

export class UploadImageResponse extends ValueObject<UploadImageResponseSchema> {
  constructor(private readonly key: string) {
    super({ key })
  }

  getKey(): string { return this.key }

  static fromAPI(data: UploadImageResponseSchema): UploadImageResponse {
    const validated = UploadImageResponseValidationSchema.parse(data)
    return new UploadImageResponse(validated.key)
  }

  toAPI(): UploadImageResponseSchema {
    return this.getValue()
  }
}