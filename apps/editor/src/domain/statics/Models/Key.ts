import {z} from 'zod'

const KeyValidations = z.object({value: z.string({required_error: 'value required'})})

export class Key {
  static create({value}: {value: string}) {
    KeyValidations.parse({value})
    return new Key(value)
  }

  constructor(public readonly value: string) {}
}
