import {Entity, Schema} from 'redis-om'

export interface BookCoverRecord extends Entity {
  key: string
  userID: string
  bookID: string
  createdAt: number
  updatedAt: number
}

export const bookCoverSchema = new Schema(
  'cervantes:bookcover',
  {
    userID: {type: 'string'},
    bookID: {type: 'string'},
    key: {type: 'string'},
    createdAt: {type: 'number'},
    updatedAt: {type: 'number'}
  },
  {
    dataStructure: 'JSON'
  }
)
