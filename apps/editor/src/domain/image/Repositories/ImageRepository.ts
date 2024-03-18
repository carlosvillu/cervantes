import {ID} from '../../_kernel/ID'
import {BookCover} from '../Models/BookCover'
import {ChapterCover} from '../Models/ChapterCover'
import {ListKey} from '../Models/ListKey'
import {Prompt} from '../Models/Prompt'

export interface ImageRepository {
  createBookCover: (cover: BookCover) => Promise<BookCover>
  createChapterCover: (cover: ChapterCover) => Promise<ChapterCover>
  findBookCoverByBookID: (bookID: ID) => Promise<BookCover>
  findChapterCoverByChapterID: (chapterID: ID, bookID: ID) => Promise<ChapterCover>
  deleteBookCoverByBookID: (bookID: ID) => Promise<BookCover>
  deleteChapterCoverByChapterID: (chapterID: ID, bookID: ID) => Promise<ChapterCover>
  generateFromPrompt: (prompt: Prompt) => Promise<ListKey>
}
