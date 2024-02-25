import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {Image} from './Image.js'
import {Result} from './Result.js'

const UploadImageResultValidations = z.object({
  id: z.instanceof(ID, {message: 'ID is required'}),
  image: z.instanceof(Image, {message: 'image is required'}),
  result: z.instanceof(Result, {message: 'result is required'}),
  cause: z.instanceof(Error).optional()
})

export class UploadImageResult {
  static create({id, image, result, cause}: z.infer<typeof UploadImageResultValidations>) {
    UploadImageResultValidations.parse({id, image, result, cause})
    return new UploadImageResult(id, image, result, cause, false)
  }

  static empty() {
    return new UploadImageResult(undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly _id?: ID,
    public readonly _image?: Image,
    public readonly _result?: Result,
    public readonly _cause?: Error,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line
  get image() {return this._image} // eslint-disable-line 
  get result() {return this._result?.value} // eslint-disable-line 
  get cause() {return this._cause} // eslint-disable-line 

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  isSuccess() {
    return this._result?.isSuccess()
  }

  toJSON() {
    return {
      id: this.id,
      image: this.image?.toJSON(),
      result: this.result,
      key: this.image?.key(),
      ...(this.cause && {cause: this.cause})
    }
  }
}
