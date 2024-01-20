import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Body} from './Body.js'
import {Chapter, ChapterJSON} from './Chapter.js'

const kinds = ['options'] as [string, ...string[]]

export const LinkValidations = z.object({
  id: z.instanceof(ID, {message: 'ID required'}),
  userID: z.instanceof(ID, {message: 'userID required'}),
  bookID: z.instanceof(ID, {message: 'bookID required'}),
  from: z.instanceof(ID, {message: 'from required'}),
  to: z.instanceof(ID, {message: 'to required'}),
  kind: z.enum(kinds, {required_error: 'kind is required'}),
  body: z.instanceof(Body, {message: 'Body required'}),
  createdAt: z.instanceof(TimeStamp).optional(),
  fromChapter: z.instanceof(Chapter).optional(),
  toChapter: z.instanceof(Chapter).optional()
})

export interface LinkJSON {
  id: string
  userID: string
  bookID: string
  from: string
  to: string
  kind: z.infer<typeof LinkValidations>['kind']
  body: string
  createdAt: number
  fromChapter?: ChapterJSON
  toChapter?: ChapterJSON
}

export class Link {
  static Kinds = kinds
  static create({
    id,
    body,
    from,
    to,
    kind,
    userID,
    bookID,
    createdAt,
    fromChapter,
    toChapter
  }: z.infer<typeof LinkValidations>) {
    LinkValidations.parse({id, body, from, to, kind, userID, bookID, createdAt})

    return new Link(
      id,
      body,
      from,
      to,
      kind,
      userID,
      bookID,
      createdAt ?? TimeStamp.now(),
      fromChapter ?? Chapter.empty(),
      toChapter ?? Chapter.empty(),
      false
    )
  }

  static empty() {
    return new Link(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true
    )
  }

  constructor(
    public readonly _id?: ID,
    public readonly _body?: Body,
    public readonly _from?: ID,
    public readonly _to?: ID,
    public readonly _kind?: z.infer<typeof LinkValidations>['kind'],
    public readonly _userID?: ID,
    public readonly _bookID?: ID,
    public readonly _createdAt?: TimeStamp,
    public readonly _fromChapter?: Chapter,
    public readonly _toChapter?: Chapter,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line
  get body() {return this._body?.value} // eslint-disable-line
  get from() {return this._from?.value} // eslint-disable-line
  get to() {return this._to?.value} // eslint-disable-line
  get kind() {return this._kind} // eslint-disable-line
  get userID() {return this._userID?.value} // eslint-disable-line
  get bookID() {return this._bookID?.value} // eslint-disable-line
  get fromChapter() {return this._fromChapter?.title} // eslint-disable-line 
  get toChapter() {return this._toChapter?.title} // eslint-disable-line 
  get createdAt() {return this._createdAt?.value} // eslint-disable-line

  attributes() {
    return {
      body: this.body,
      from: this.from,
      to: this.to,
      kind: this.kind,
      userID: this.userID,
      bookID: this.bookID,
      createdAt: this.createdAt
    }
  }

  toJSON() {
    return {
      id: this.id,
      body: this.body,
      from: this.from,
      to: this.to,
      kind: this.kind,
      userID: this.userID,
      bookID: this.bookID,
      createdAt: this.createdAt,
      ...(!this._toChapter?.isEmpty() && {toChapter: this._toChapter?.toJSON()}),
      ...(!this._fromChapter?.isEmpty() && {fromChapter: this._fromChapter?.toJSON()})
    }
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }
}
