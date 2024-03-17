import {z} from 'zod'

export const ImageGenerationBodySchema = z
  .object({
    url: z.string({required_error: 'url required'}),
    seed: z.string({required_error: 'seed required'}),
    finish_reason: z.string({required_error: 'finish_reason required'})
  })
  .array()
export type ImageGenerationBodyType = z.infer<typeof ImageGenerationBodySchema>
