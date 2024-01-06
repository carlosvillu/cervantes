import {z} from 'zod'

const SummaryValidations = z.object({value: z.string({required_error: 'Summary required'})})

export class Summary {
  static create({value}: {value: string}) {
    SummaryValidations.parse({value})
    return new Summary(value)
  }

  constructor(public readonly value: string) {}
}
