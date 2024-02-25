import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {Stage} from '../../_kernel/Stage.js'
import {Data} from '../Models/Data.js'
import {Name} from '../Models/Name.js'
import {MimeType} from './MimeType.js'

const ImageValidations = z.object({
  id: z.instanceof(ID, {message: 'ID is required'}),
  name: z.instanceof(Name, {message: 'Name is required'}),
  data: z.instanceof(Data, {message: 'Data is required'}),
  stage: z.instanceof(Stage, {message: 'Stage is required'}),
  mimetype: z.instanceof(MimeType, {message: 'MimeType is required'})
})

export class Image {
  static create({id, name, data, stage, mimetype}: z.infer<typeof ImageValidations>) {
    ImageValidations.parse({id, name, data, stage, mimetype})
    return new Image(id, name, data, stage, mimetype, false)
  }

  static empty() {
    return new Image(undefined, undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly _id?: ID,
    public readonly _name?: Name,
    public _data?: Data,
    public readonly _stage?: Stage,
    public readonly _mimetype?: MimeType,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line
  get name() {return this._name?.value} // eslint-disable-line 
  get data() {return this._data?.value} // eslint-disable-line 
  get stage() {return this._stage?.value} // eslint-disable-line 
  get mimetype() {return this._mimetype?.value} // eslint-disable-line 

  key() {
    if (this.isEmpty()) return ''
    return `${this.stage!}/${this.id!}.${this.extension()}`
  }

  extension() {
    if (this.isEmpty()) return ''
    const [ext] = this.name!.split('.').reverse()
    return ext
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  stripData() {
    this._data = undefined
    return this
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      data: this.data,
      stage: this.stage,
      mimetype: this.mimetype
    }
  }
}
