import {z} from 'zod'

const IDValidations = z.object({
  value: z.string({required_error: 'ID is required'})
})

export class ID {
  static create({value}: z.infer<typeof IDValidations>) {
    IDValidations.parse({value})
    return new ID(value)
  }

  constructor(public readonly value: string) {}
}
