import {z} from 'zod'

import type {components} from '../../generated/api-types'
import {ValueObject} from '../_kernel/types'

type GenerateImageResponseSchema = components['schemas']['GenerateImageResponse']

export const GenerateImageResponseValidationSchema = z.array(z.string())

export class GenerateImageResponse extends ValueObject<GenerateImageResponseSchema> {
  constructor(private readonly imageKeys: string[]) {
    super(imageKeys)
  }

  getImageKeys(): string[] {
    return this.imageKeys
  }

  getImageCount(): number {
    return this.imageKeys.length
  }

  hasImages(): boolean {
    return this.imageKeys.length > 0
  }

  static fromAPI(data: GenerateImageResponseSchema): GenerateImageResponse {
    const validated = GenerateImageResponseValidationSchema.parse(data)
    return new GenerateImageResponse(validated)
  }

  toAPI(): GenerateImageResponseSchema {
    return this.getValue()
  }
}
