import {Entity, Schema} from 'redis-om'

export interface BodyRecord extends Entity {
  userID: string
  bookID: string
  chapterID: string
  content: string
  createdAt: number
  hash: string
}

export const bodySchema = new Schema(
  'cervantes:body',
  {
    userID: {type: 'string'},
    bookID: {type: 'string'},
    chapterID: {type: 'string'},
    content: {type: 'string'},
    hash: {type: 'string'},
    createdAt: {type: 'number', sortable: true}
  },
  {
    dataStructure: 'JSON'
  }
)
