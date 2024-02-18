import {z} from 'zod'

const ValidationStatusValidations = z.object({
  value: z.boolean({required_error: 'value is required'})
})

export class ValidationStatus {
  static create({value}: z.infer<typeof ValidationStatusValidations>) {
    ValidationStatusValidations.parse({value})

    return new ValidationStatus(value)
  }

  static success() {
    return new ValidationStatus(true)
  }

  static failed() {
    return new ValidationStatus(false)
  }

  constructor(public readonly value: boolean) {}

  isSuccess() {
    return this.value
  }

  toJSON() {
    return {value: this.value}
  }
}
