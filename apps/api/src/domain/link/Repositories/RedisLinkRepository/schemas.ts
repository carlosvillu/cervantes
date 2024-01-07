import {Entity, Schema} from 'redis-om'

export interface LinkRecord extends Entity {
  body: string
  from: string
  to: string
  kind: string
  userID: string
  bookID: string
  createdAt: number
}

export const linkSchema = new Schema(
  'cervantes:link',
  {
    body: {type: 'string'},
    from: {type: 'string'},
    to: {type: 'string'},
    kind: {type: 'string'},
    userID: {type: 'string'},
    bookID: {type: 'string'},
    createdAt: {type: 'number'}
  },
  {
    dataStructure: 'JSON'
  }
)
