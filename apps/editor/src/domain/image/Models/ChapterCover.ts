import {z} from 'zod'

import {ID} from '../../_kernel/ID.js'
import {TimeStamp} from '../../_kernel/TimeStamp.js'
import {Key} from './Key.js'

const ChapterCoverValidations = z.object({
  id: z.instanceof(ID, {message: 'ID required'}),
  bookID: z.instanceof(ID, {message: 'bookID required'}),
  chapterID: z.instanceof(ID, {message: 'chapterID required'}),
  key: z.instanceof(Key, {message: 'key required'}),
  createdAt: z.instanceof(TimeStamp).optional(),
  updatedAt: z.instanceof(TimeStamp).optional()
})

export class ChapterCover {
  static create({id, bookID, chapterID, key, createdAt, updatedAt}: z.infer<typeof ChapterCoverValidations>) {
    ChapterCoverValidations.parse({id, bookID, chapterID, key, createdAt, updatedAt})
    return new ChapterCover(
      id,
      bookID,
      chapterID,
      key,
      createdAt ?? TimeStamp.now(),
      updatedAt ?? TimeStamp.now(),
      false
    )
  }

  static empty() {
    return new ChapterCover(undefined, undefined, undefined, undefined, undefined, undefined, true)
  }

  constructor(
    public readonly _id?: ID,
    public readonly _bookID?: ID,
    public readonly _chapterID?: ID,
    public readonly _key?: Key,
    public readonly _createdAt?: TimeStamp,
    public readonly _updatedAt?: TimeStamp,
    public readonly empty?: boolean
  ) {}

  get id() {return this._id?.value} // eslint-disable-line
  get bookID() {return this._bookID?.value} // eslint-disable-line
  get chapterID() {return this._chapterID?.value} // eslint-disable-line
  get key() {return this._key?.value} // eslint-disable-line
  get createdAt() {return this._createdAt?.value} // eslint-disable-line
  get updatedAt() {return this._updatedAt?.value} // eslint-disable-line

  url() {
    if (this.isEmpty()) return undefined

    return import.meta.env.VITE_IMAGE_CDN + '/' + this.key + '?height=430&aspect-ratio=1%3A1.5&mode=crop&format=webp'
  }

  attributes() {
    return {
      bookID: this.bookID,
      chapterID: this.chapterID,
      key: this.key,
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
