import {Entity, Schema} from 'redis-om'

export interface ChapterRecord extends Entity {
  title: string
  summary: string
  userID: string
  bookID: string
  isRoot: boolean
  createdAt: number
  updatedAt: number
}

export const chapterSchema = new Schema(
  'cervantes:chapter',
  {
    title: {type: 'string'},
    summary: {type: 'string'},
    userID: {type: 'string'},
    bookID: {type: 'string'},
    isRoot: {type: 'boolean'},
    createdAt: {type: 'number'},
    updatedAt: {type: 'number'}
  },
  {
    dataStructure: 'JSON'
  }
)
