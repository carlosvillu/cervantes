import {Entity, Schema} from 'redis-om'

export interface TokenRecord extends Entity {
  userID: string
  token: string
  createdAt: number
}

export interface ValidationTokenRecord extends Entity {
  userID: string
  token: string
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

export const validationTokenSchema = new Schema(
  'cervantes:validationToken',
  {
    userID: {type: 'string'},
    token: {type: 'string'}
  },
  {dataStructure: 'JSON'}
)
