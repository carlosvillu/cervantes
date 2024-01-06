import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Summary} from './Summary.js'
import {Title} from './Title.js'

const BookValidations = z.object({
  id: z.instanceof(ID, {message: 'ID required'}),
  userID: z.instanceof(ID, {message: 'userID required'}),
  title: z.instanceof(Title, {message: 'title required'}),
  summary: z.instanceof(Summary, {message: 'Summary required'}),
  createdAt: z.instanceof(TimeStamp).optional()
})

export class Book {
  static create({id, userID, title, summary, createdAt}: z.infer<typeof BookValidations>) {
    BookValidations.parse({id, userID, title, summary, createdAt})
    return new Book(id, userID, title, summary, createdAt ?? TimeStamp.now(), false)
  }

  static empty() {
    return new Book(undefined, undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly _id?: ID,
    public readonly _userID?: ID,
    public readonly _title?: Title,
    public readonly _summary?: Summary,
    public readonly _createdAt?: TimeStamp,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line
  get userID() {return this._userID?.value} // eslint-disable-line
  get summary() {return this._summary?.value} // eslint-disable-line
  get title() {return this._title?.value} // eslint-disable-line
  get createdAt() {return this._createdAt?.value} // eslint-disable-line

  attributes() {
    return {
      userID: this.userID,
      title: this.title,
      summary: this.summary,
      createdAt: this.createdAt
    }
  }

  toJSON() {
    return {
      id: this.id,
      userID: this.userID,
      title: this.title,
      summary: this.summary,
      createdAt: this.createdAt
    }
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }
}
