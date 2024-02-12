import type {ID} from '../../_kernel/ID.js'
import type {Chapter} from '../Models/Chapter.js'
import type {Chapters} from '../Models/Chapters.js'

export interface ChapterRepository {
  create: (chapter: Chapter) => Promise<Chapter>
  update: (chapter: Chapter) => Promise<Chapter>
  findAll: (bookID: ID) => Promise<Chapters>
  findByID: (chapterID: ID, bookID: ID) => Promise<Chapter>
  removeByID: (chapterID: ID, bookID: ID) => Promise<Chapter>
  getRootChapter: (bookID: ID) => Promise<Chapter>
}
