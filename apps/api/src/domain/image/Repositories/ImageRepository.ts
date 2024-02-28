import {ID} from '../../_kernel/ID.js'
import {BookCover} from '../Models/BookCover.js'

export interface ImageRepository {
  createBookCover: (cover: BookCover) => Promise<BookCover>
  findBookCover: (bookID: ID, userID: ID) => Promise<BookCover>
}
