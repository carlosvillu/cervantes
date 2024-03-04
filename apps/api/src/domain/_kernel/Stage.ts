import {z} from 'zod'

const kinds = ['development', 'production'] as [string, ...string[]]

export const StageValidations = z.object({
  value: z.enum(kinds, {required_error: 'value is required'})
})

export class Stage {
  static create({value}: z.infer<typeof StageValidations>) {
    StageValidations.parse({value})

    return new Stage(value)
  }

  constructor(public readonly value: string) {}
}
