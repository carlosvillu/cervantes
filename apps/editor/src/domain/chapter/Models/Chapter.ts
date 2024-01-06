import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Summary} from './Summary.js'
import {Title} from './Title.js'

const ChapterValidations = z.object({
  id: z.instanceof(ID, {message: 'ID required'}),
  userID: z.instanceof(ID, {message: 'userID required'}),
  bookID: z.instanceof(ID, {message: 'bookID required'}),
  title: z.instanceof(Title, {message: 'title required'}),
  summary: z.instanceof(Summary, {message: 'Summary required'}),
  createdAt: z.instanceof(TimeStamp).optional()
})

export interface ChapterJSON {
  id: string
  userID: string
  bookID: string
  title: string
  summary: string
  createdAt: string
}

export class Chapter {
  static create({id, userID, bookID, title, summary, createdAt}: z.infer<typeof ChapterValidations>) {
    ChapterValidations.parse({id, userID, bookID, title, summary, createdAt})
    return new Chapter(id, userID, bookID, title, summary, createdAt ?? TimeStamp.now(), false)
  }

  static empty() {
    return new Chapter(undefined, undefined, undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly _id?: ID,
    public readonly _userID?: ID,
    public readonly _bookID?: ID,
    public readonly _title?: Title,
    public readonly _summary?: Summary,
    public readonly _createdAt?: TimeStamp,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line
  get userID() {return this._userID?.value} // eslint-disable-line
  get bookID() {return this._bookID?.value} // eslint-disable-line
  get summary() {return this._summary?.value} // eslint-disable-line
  get title() {return this._title?.value} // eslint-disable-line
  get createdAt() {return this._createdAt?.value} // eslint-disable-line

  attributes() {
    return {
      userID: this.userID,
      bookID: this.bookID,
      title: this.title,
      summary: this.summary,
      createdAt: this.createdAt
    }
  }

  toJSON() {
    return {
      id: this.id,
      userID: this.userID,
      bookID: this.bookID,
      title: this.title,
      summary: this.summary,
      createdAt: this.createdAt
    }
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }
}
