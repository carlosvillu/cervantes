import {createHash} from 'crypto'

import {z} from 'zod'

const HashValidations = z.object({value: z.string({required_error: 'Hash required'})})

export class Hash {
  static create({value}: z.infer<typeof HashValidations>) {
    HashValidations.parse({value})
    return new Hash(createHash('md5').update(value).digest('hex'))
  }

  static fromHashedValue({value}: z.infer<typeof HashValidations>) {
    HashValidations.parse({value})
    return new Hash(value)
  }

  constructor(public readonly value: string) {}
}
