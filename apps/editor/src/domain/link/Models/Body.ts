import {z} from 'zod'

const BodyValidations = z.object({value: z.string({required_error: 'Body required'})})

export class Body {
  static create({value}: {value: string}) {
    BodyValidations.parse({value})
    return new Body(value)
  }

  constructor(public readonly value: string) {}
}
