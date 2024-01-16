import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'

export const BodyValidations = z.object({
  id: z.instanceof(ID, {message: 'ID required'}),
  userID: z.instanceof(ID, {message: 'userID required'}),
  bookID: z.instanceof(ID, {message: 'bookID required'}),
  chapterID: z.instanceof(ID, {message: 'chapterID required'}),
  content: z.string({required_error: 'content required'}),
  createdAt: z.instanceof(TimeStamp).optional()
})

export interface BodyJSON {
  id: string
  userID: string
  bookID: string
  chapterID: string
  content: string
  createdAt: number
}

export class Body {
  static create({id, userID, bookID, chapterID, content, createdAt}: z.infer<typeof BodyValidations>) {
    BodyValidations.parse({id, userID, bookID, chapterID, content, createdAt})

    return new Body(id, userID, bookID, chapterID, content, createdAt ?? TimeStamp.now(), false)
  }

  static empty() {
    return new Body(undefined, undefined, undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly _id?: ID,
    public readonly _userID?: ID,
    public readonly _bookID?: ID,
    public readonly _chapterID?: ID,
    public readonly _content?: string,
    public readonly _createdAt?: TimeStamp,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line
  get userID() {return this._userID?.value} // eslint-disable-line
  get bookID() {return this._bookID?.value} // eslint-disable-line
  get chapterID() {return this._chapterID?.value} // eslint-disable-line
  get content() {return this._content} // eslint-disable-line
  get createdAt() {return this._createdAt?.value} // eslint-disable-line

  attributes() {
    return {
      userID: this.userID,
      bookID: this.bookID,
      chapterID: this.chapterID,
      content: this.content,
      createdAt: this.createdAt
    }
  }

  toJSON() {
    return {
      id: this.id,
      userID: this.userID,
      bookID: this.bookID,
      chapterID: this.chapterID,
      content: this.content,
      createdAt: this.createdAt
    }
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }
}
