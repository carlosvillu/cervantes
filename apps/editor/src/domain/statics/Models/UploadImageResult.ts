import {z} from 'zod'

import {ID} from '../../_kernel/ID'
import {Key} from './Key'
import {Result} from './Result'

const UploadImageResultValidations = z.object({
  id: z.instanceof(ID, {message: 'ID is missing'}),
  key: z.instanceof(Key, {message: 'Key is missing'}),
  result: z.instanceof(Result, {message: 'Result is missing'})
})

export class UploadImageResult {
  static create({id, key, result}: z.infer<typeof UploadImageResultValidations>) {
    UploadImageResultValidations.parse({id, key, result})
    return new UploadImageResult(id, key, result, false)
  }

  static empty() {
    return new UploadImageResult(undefined, undefined, undefined, true)
  }

  constructor(
    public readonly _id?: ID,
    public readonly _key?: Key,
    public readonly _result?: Result,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line 
  get key() {return this._key?.value} // eslint-disable-line 
  get result() {return this._result?.value} // eslint-disable-line 

  success() {
    return Boolean(this.result)
  }

  toJSON() {
    return {
      id: this.id,
      key: this.key,
      result: this.result
    }
  }
}
