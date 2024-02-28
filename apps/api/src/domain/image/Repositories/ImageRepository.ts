import {ID} from '../../_kernel/ID.js'
import {BookCover} from '../Models/BookCover.js'

export interface ImageRepository {
  setBookCover: (cover: BookCover) => Promise<BookCover>
  getBookCover: (bookID: ID, userID: ID) => Promise<BookCover>
}
