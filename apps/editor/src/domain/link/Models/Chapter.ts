import {z} from 'zod'

import {ID} from '../../_kernel/ID'
import {Title} from './Title'

const ChapterValidations = z.object({
  id: z.instanceof(ID, {message: 'id required'}),
  title: z.instanceof(Title, {message: 'title required'})
})

export interface ChapterJSON {
  id: string
  title: string
}

export class Chapter {
  static create({id, title}: z.infer<typeof ChapterValidations>) {
    ChapterValidations.parse({id, title})
    return new Chapter(id, title, false)
  }

  static empty() {
    return new Chapter(undefined, undefined, true)
  }

  constructor(private readonly _id?: ID, private readonly _title?: Title, private readonly empty?: boolean) {}

  get id() {return this._id?.value} // eslint-disable-line 
  get title() {return this._title?.value} // eslint-disable-line 

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title
    }
  }
}
