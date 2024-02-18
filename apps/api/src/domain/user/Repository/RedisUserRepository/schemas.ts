import {Entity, Schema} from 'redis-om'

export interface UserRecord extends Entity {
  username: string
  password: string
  email: string
  verified: boolean
}

export const userSchema = new Schema(
  'cervantes:user',
  {
    username: {type: 'string'},
    password: {type: 'string'},
    email: {type: 'string'},
    verified: {type: 'boolean'}
  },
  {
    dataStructure: 'JSON'
  }
)
