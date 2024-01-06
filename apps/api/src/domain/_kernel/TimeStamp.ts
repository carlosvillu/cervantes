import {z} from 'zod'

const TimeStampValidations = z.object({value: z.number()})

export class TimeStamp {
  static create({value}: z.infer<typeof TimeStampValidations>) {
    TimeStampValidations.parse({value})
    return new TimeStamp(value)
  }

  static now() {
    return new TimeStamp(Date.now())
  }

  constructor(public readonly value: number) {}
}
