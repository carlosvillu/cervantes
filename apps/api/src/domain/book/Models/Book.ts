import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {PublishStatus} from './PublishStatud.js'
import {Summary} from './Summary.js'
import {Title} from './Title.js'

const BookValidations = z.object({
  id: z.instanceof(ID, {message: 'ID required'}),
  userID: z.instanceof(ID, {message: 'userID required'}),
  title: z.instanceof(Title, {message: 'title required'}),
  summary: z.instanceof(Summary, {message: 'Summary required'}),
  published: z.instanceof(PublishStatus, {message: 'published required'}),
  rootChapterID: z.instanceof(ID, {message: 'rootChapterID required'}).optional(),
  createdAt: z.instanceof(TimeStamp).optional(),
  updatedAt: z.instanceof(TimeStamp).optional()
})

export class Book {
  static create({
    id,
    userID,
    title,
    summary,
    published,
    rootChapterID,
    createdAt,
    updatedAt
  }: z.infer<typeof BookValidations>) {
    BookValidations.parse({id, userID, title, published, summary, createdAt, updatedAt})
    return new Book(
      id,
      userID,
      title,
      summary,
      published,
      rootChapterID,
      createdAt ?? TimeStamp.now(),
      updatedAt ?? TimeStamp.now(),
      false
    )
  }

  static empty() {
    return new Book(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly _id?: ID,
    public readonly _userID?: ID,
    public readonly _title?: Title,
    public readonly _summary?: Summary,
    public readonly _published?: PublishStatus,
    public readonly _rootChapterID?: ID,
    public readonly _createdAt?: TimeStamp,
    public readonly _updatedAt?: TimeStamp,
    public readonly empty?: boolean
  ) {}

  get id() {
    return this._id?.value
  } // eslint-disable-line

  get userID() {
    return this._userID?.value
  } // eslint-disable-line

  get summary() {
    return this._summary?.value
  } // eslint-disable-line

  get title() {
    return this._title?.value
  } // eslint-disable-line

  get published() {
    return this._published?.value
  } // eslint-disable-line

  get rootChapterID() {
    return this._rootChapterID?.value
  } // eslint-disable-line

  get createdAt() {
    return this._createdAt?.value
  } // eslint-disable-line

  get updatedAt() {
    return this._updatedAt?.value
  } // eslint-disable-line

  attributes() {
    return {
      userID: this.userID,
      title: this.title,
      summary: this.summary,
      published: this.published,
      rootChapterID: this.rootChapterID,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  toJSON() {
    return {
      id: this.id,
      ...this.attributes()
    }
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }
}
