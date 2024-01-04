import {z} from 'zod'

const EmailValidations = z.object({
  value: z.string({required_error: 'Email is required'})
})

export class Email {
  static create({value}: z.infer<typeof EmailValidations>) {
    EmailValidations.parse({value})
    return new Email(value)
  }

  constructor(public readonly value: string) {}
}
