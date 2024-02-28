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
}
