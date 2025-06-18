import { z } from 'zod'
import { ValueObject } from '../_kernel/types'
import type { components } from '../../generated/api-types'

type GenerateImageRequestSchema = components['schemas']['GenerateImageRequest']

export const GenerateImageRequestValidationSchema = z.object({
  prompt: z.string().min(1).max(1000)
})

export class GenerateImageRequest extends ValueObject<GenerateImageRequestSchema> {
  constructor(private readonly prompt: string) {
    super({ prompt })
  }

  getPrompt(): string { return this.prompt }

  hasValidPrompt(): boolean {
    return this.prompt.trim().length > 0 && this.prompt.length <= 1000
  }

  static fromAPI(data: GenerateImageRequestSchema): GenerateImageRequest {
    const validated = GenerateImageRequestValidationSchema.parse(data)
    return new GenerateImageRequest(validated.prompt)
  }

  toAPI(): GenerateImageRequestSchema {
    return this.getValue()
  }
}