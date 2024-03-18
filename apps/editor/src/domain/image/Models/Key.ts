import {z} from 'zod'

const KeyValidations = z.object({
  value: z.string({required_error: 'Value required'})
})
export class Key {
  static create({value}: z.infer<typeof KeyValidations>) {
    KeyValidations.parse({value})

    return new Key(value)
  }

  constructor(public readonly value: string) {}

  url() {
    return import.meta.env.VITE_IMAGE_CDN + '/' + this.value + '?height=430&aspect-ratio=1%3A1.5&mode=crop&format=webp'
  }
}
