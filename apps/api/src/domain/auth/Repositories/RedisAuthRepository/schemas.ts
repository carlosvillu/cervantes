import {Entity, Schema} from 'redis-om'

export interface TokenRecord extends Entity {
  userID: string
  token: string
  createdAt: number
}

export const tokenSchema = new Schema(
  'cervantes:token',
  {
    userID: {type: 'string'},
    token: {type: 'string'},
    createdAt: {type: 'number'}
  },
  {
    dataStructure: 'JSON'
  }
)
