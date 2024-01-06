import {Entity, Schema} from 'redis-om'

export interface BookRecord extends Entity {
  title: string
  summary: string
  userID: string
  createdAt: number
}

export const bookSchema = new Schema(
  'cervantes:book',
  {
    title: {type: 'string'},
    summary: {type: 'string'},
    userID: {type: 'string'},
    createdAt: {type: 'number'}
  },
  {
    dataStructure: 'JSON'
  }
)
