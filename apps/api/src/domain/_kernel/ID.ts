import {ulid} from 'ulid'
import {z} from 'zod'

const IDValidations = z.object({value: z.string({required_error: 'ID required'})})

export class ID {
  static create({value}: z.infer<typeof IDValidations>) {
    IDValidations.parse({value})
    return new ID(value)
  }

  static random() {
    return new ID(ulid())
  }

  static empty() {
    return new ID('')
  }

  constructor(public readonly value: string) {}

  toJSON() {
    return {id: this.value}
  }

  isEmpty() {
    return this.value === ''
  }
}
