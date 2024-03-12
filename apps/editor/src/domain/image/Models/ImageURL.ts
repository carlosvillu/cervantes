import {z} from 'zod'

const ImageURLValidations = z.object({
  value: z.string({required_error: 'Value required'})
})
export class ImageURL {
  static create({value}: z.infer<typeof ImageURLValidations>) {
    ImageURLValidations.parse({value})

    return new ImageURL(value)
  }

  constructor(public readonly value: string) {}
}
