import type {ID} from '../../_kernel/ID.js'
import type {Chapter} from '../Models/Chapter.js'
import type {Chapters} from '../Models/Chapters.js'

export interface ChapterRepository {
  create: (chapter: Chapter) => Promise<Chapter>
  update: (chapter: Chapter) => Promise<Chapter>
  findAll: (userID: ID, bookID: ID) => Promise<Chapters>
  findByID: (chapterID: ID, userID: ID, bookID: ID) => Promise<Chapter>
}
