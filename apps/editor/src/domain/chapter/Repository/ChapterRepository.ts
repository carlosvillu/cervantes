import type {ID} from '../../_kernel/ID.js'
import type {Chapter} from '../Models/Chapter.js'
import type {Chapters} from '../Models/Chapters.js'

export interface ChapterRepository {
  create: (chapter: Chapter) => Promise<Chapter>
  findAll: (bookID: ID) => Promise<Chapters>
  findByID: (chapterID: ID, bookID: ID) => Promise<Chapter>
}
