import {z} from 'zod'

const URLValidations = z.object({
  value: z.string({required_error: 'Value required'})
})
export class URL {
  static create({value}: z.infer<typeof URLValidations>) {
    URLValidations.parse({value})

    return new URL(value)
  }

  constructor(public readonly value: string) {}
}
