import {z} from 'zod'

const TitleValidations = z.object({value: z.string({required_error: 'Title required'})})

export class Title {
  static create({value}: z.infer<typeof TitleValidations>) {
    TitleValidations.parse({value})
    return new Title(value)
  }

  constructor(public readonly value: string) {}
}
