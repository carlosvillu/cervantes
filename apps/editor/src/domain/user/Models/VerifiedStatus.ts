import {z} from 'zod'

const VerifiedStatusValidations = z.object({
  value: z.boolean({required_error: 'VerifiedStatus is required'})
})

export class VerifiedStatus {
  static create({value}: z.infer<typeof VerifiedStatusValidations>) {
    VerifiedStatusValidations.parse({value})
    return new VerifiedStatus(value)
  }

  static failed() {
    return new VerifiedStatus(false)
  }

  constructor(public readonly value: boolean) {}
}
