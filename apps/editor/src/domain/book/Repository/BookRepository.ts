import {ID} from '../../_kernel/ID.js'
import {Book} from '../Models/Book.js'
import {Books} from '../Models/Books.js'

export interface BookRepository {
  create: (book: Book) => Promise<Book>
  findAll: () => Promise<Books>
  findByID: (id: ID) => Promise<Book>
}
