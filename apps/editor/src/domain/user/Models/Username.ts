import {z} from 'zod'

const UsernameValidations = z.object({
  value: z.string({required_error: 'Username is required'})
})

export class Username {
  static create({value}: z.infer<typeof UsernameValidations>) {
    UsernameValidations.parse({value})
    return new Username(value)
  }

  constructor(public readonly value: string) {}
}
