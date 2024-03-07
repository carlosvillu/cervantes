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

export interface ChapterCoverRecord extends Entity {
  key: string
  userID: string
  bookID: string
  chapterID: string
  createdAt: number
  updatedAt: number
}

export const chapterCoverSchema = new Schema(
  'cervantes:chaptercover',
  {
    userID: {type: 'string'},
    bookID: {type: 'string'},
    chapterID: {type: 'string'},
    key: {type: 'string'},
    createdAt: {type: 'number'},
    updatedAt: {type: 'number'}
  },
  {
    dataStructure: 'JSON'
  }
)
