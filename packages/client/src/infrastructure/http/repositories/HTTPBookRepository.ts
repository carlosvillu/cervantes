/**
 * HTTPBookRepository - HTTP implementation of BookRepository
 *
 * This class implements the BookRepository interface using HTTP calls through HTTPClient.
 * It handles all book-related API operations following Clean Architecture patterns.
 */

import {Book, BookValidationSchema} from '../../../domain/book/Book.js'
import type {BookRepository} from '../../../domain/book/BookRepository.js'
import type {CreateBookRequest} from '../../../domain/book/CreateBookRequest.js'
import type {UpdateBookRequest} from '../../../domain/book/UpdateBookRequest.js'
import type {HTTPClient} from '../types.js'

export class HTTPBookRepository implements BookRepository {
  constructor(private readonly httpClient: HTTPClient) {}

  async create(request: CreateBookRequest): Promise<Book> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.post('/book', {body: requestData}, BookValidationSchema)

    if (error) {
      throw error
    }

    return Book.fromAPI(
      data as {
        id: string
        userID: string
        title: string
        summary: string
        published: boolean
        rootChapterID?: string | null
        createdAt: number
        updatedAt: number
      }
    )
  }

  async findByID(id: string): Promise<Book> {
    const [error, data] = await this.httpClient.get(`/book/${encodeURIComponent(id)}`, {}, BookValidationSchema)

    if (error) {
      throw error
    }

    return Book.fromAPI(
      data as {
        id: string
        userID: string
        title: string
        summary: string
        published: boolean
        rootChapterID?: string | null
        createdAt: number
        updatedAt: number
      }
    )
  }

  async getAll(): Promise<Book[]> {
    const [error, data] = await this.httpClient.get(
      '/book',
      {},
      BookValidationSchema.array() // Validate as array of books
    )

    if (error) {
      throw error
    }

    // Convert array of API data to Book domain objects
    const books = data as Array<{
      id: string
      userID: string
      title: string
      summary: string
      published: boolean
      rootChapterID?: string | null
      createdAt: number
      updatedAt: number
    }>

    return books.map(bookData => Book.fromAPI(bookData))
  }

  async update(id: string, request: UpdateBookRequest): Promise<Book> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.put(
      `/book/${encodeURIComponent(id)}`,
      {body: requestData},
      BookValidationSchema
    )

    if (error) {
      throw error
    }

    return Book.fromAPI(
      data as {
        id: string
        userID: string
        title: string
        summary: string
        published: boolean
        rootChapterID?: string | null
        createdAt: number
        updatedAt: number
      }
    )
  }
}
