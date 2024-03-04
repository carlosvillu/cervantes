import {ID} from '../../_kernel/ID'
import {BookCover} from '../Models/BookCover'

export interface ImageRepository {
  createBookCover: (cover: BookCover) => Promise<BookCover>
  findBookCoverByBookID: (bookID: ID) => Promise<BookCover>
  deleteBookCoverByBookID: (bookID: ID) => Promise<BookCover>
}
