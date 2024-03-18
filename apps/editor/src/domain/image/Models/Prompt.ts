import {z} from 'zod'

const PromptValidations = z.object({
  value: z.string({required_error: 'Value required'})
})
export class Prompt {
  static create({value}: z.infer<typeof PromptValidations>) {
    PromptValidations.parse({value})

    return new Prompt(value)
  }

  constructor(public readonly value: string) {}
}
