import {ID} from '../../_kernel/ID.js'
import {BookCover} from '../Models/BookCover.js'
import {ChapterCover} from '../Models/ChapterCover.js'

export interface ImageRepository {
  createBookCover: (cover: BookCover) => Promise<BookCover>
  createChapterCover: (cover: ChapterCover) => Promise<ChapterCover>
  findBookCover: (bookID: ID, userID: ID) => Promise<BookCover>
  findChapterCover: (chapterID: ID, bookID: ID, userID: ID) => Promise<ChapterCover>
  deleteBookCover: (bookID: ID, userID: ID) => Promise<BookCover>
  deleteChapterCover: (chapterID: ID, bookID: ID, userID: ID) => Promise<ChapterCover>
}
