import {Entity, Schema} from 'redis-om'

export interface BookRecord extends Entity {
  title: string
  summary: string
  userID: string
  published: boolean
  createdAt: number
  updatedAt: number
}

export const bookSchema = new Schema(
  'cervantes:book',
  {
    title: {type: 'string'},
    summary: {type: 'string'},
    published: {type: 'boolean'},
    userID: {type: 'string'},
    createdAt: {type: 'number'},
    updatedAt: {type: 'number'}
  },
  {
    dataStructure: 'JSON'
  }
)
