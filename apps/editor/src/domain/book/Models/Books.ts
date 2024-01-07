import {z} from 'zod'

import {Book} from './Book'

const BooksValidations = z.object({books: z.instanceof(Book, {message: 'Books required'}).array()})

export class Books {
  static create({books}: z.infer<typeof BooksValidations>) {
    BooksValidations.parse({books})
    return new Books(books, false)
  }

  static empty() {
    return new Books(undefined, true)
  }

  constructor(public readonly books: Book[] = [], public readonly empty?: boolean) {}

  titles(): string[] {
    return this.books.filter(book => !book.isEmpty()).map(book => book.id!)
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  map<T>(fn: (book: Book) => T): T[] {
    return this.books.map(book => fn(book))
  }
}
