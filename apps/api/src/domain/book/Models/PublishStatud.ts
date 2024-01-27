import {z} from 'zod'

const PublishStatusValidations = z.object({value: z.boolean({required_error: 'PublishStatus required'})})

export class PublishStatus {
  static create({value}: z.infer<typeof PublishStatusValidations>) {
    PublishStatusValidations.parse({value})
    return new PublishStatus(value)
  }

  constructor(public readonly value: boolean) {}
}
