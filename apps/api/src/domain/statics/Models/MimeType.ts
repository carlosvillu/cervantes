import {z} from 'zod'
const kinds = ['image/png', 'image/jpeg'] as [string, ...string[]]

export const StageValidations = z.object({
  value: z.enum(kinds, {required_error: 'value is required'})
})
export class MimeType {
  static create({value}: {value: string}) {
    return new MimeType(value)
  }

  constructor(public readonly value: string) {}
}
