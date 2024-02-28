import {z} from 'zod'

const ImageValidations = z.object({value: z.instanceof(File, {message: 'File required'})})

export class Image {
  static create({value}: {value: File}) {
    ImageValidations.parse({value})
    return new Image(value)
  }

  constructor(public readonly value: File) {}
}
