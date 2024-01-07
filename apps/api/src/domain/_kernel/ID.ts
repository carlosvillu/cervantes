import {z} from 'zod'

const IDValidations = z.object({value: z.string({required_error: 'ID required'})})

export class ID {
  static create({value}: {value: string}) {
    IDValidations.parse({value})
    return new ID(value)
  }

  constructor(public readonly value: string) {}

  toJSON() {
    return {id: this.value}
  }
}
