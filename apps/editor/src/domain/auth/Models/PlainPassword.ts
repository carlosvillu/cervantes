import {z} from 'zod'

const PlainPasswordValidations = z.object({
  value: z.string({required_error: 'Email is required'})
})

export class PlainPassword {
  static create({value}: z.infer<typeof PlainPasswordValidations>) {
    PlainPasswordValidations.parse({value})
    return new PlainPassword(value)
  }

  constructor(public readonly value: string) {}
}
