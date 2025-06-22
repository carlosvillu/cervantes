/**
 * BookService - Public book service interface
 *
 * This service provides a high-level API for all book operations.
 * It coordinates between Book Use Cases and Repository implementations.
 */

import type {Book} from '../../domain/book/Book.js'
import type {BookRepository} from '../../domain/book/BookRepository.js'
import {
  type CreateBookUseCaseInput,
  type FindByIDBookUseCaseInput,
  type GetAllBooksUseCaseInput,
  type UpdateBookUseCaseInput,
  CreateBookUseCase,
  FindByIDBookUseCase,
  GetAllBooksUseCase,
  UpdateBookUseCase
} from './usecases/index.js'

export interface BookServiceConfig {
  repository: BookRepository
}

export class BookService {
  private readonly bookRepository: BookRepository

  // Use Cases
  private readonly createBookUseCase: CreateBookUseCase
  private readonly findByIDBookUseCase: FindByIDBookUseCase
  private readonly getAllBooksUseCase: GetAllBooksUseCase
  private readonly updateBookUseCase: UpdateBookUseCase

  constructor(config: BookServiceConfig) {
    this.bookRepository = config.repository

    // Initialize Use Cases
    this.createBookUseCase = new CreateBookUseCase(this.bookRepository)
    this.findByIDBookUseCase = new FindByIDBookUseCase(this.bookRepository)
    this.getAllBooksUseCase = new GetAllBooksUseCase(this.bookRepository)
    this.updateBookUseCase = new UpdateBookUseCase(this.bookRepository)
  }

  /**
   * Create a new book
   */
  async create(input: CreateBookUseCaseInput): Promise<Book> {
    return this.createBookUseCase.execute(input)
  }

  /**
   * Find a book by its ID
   */
  async findByID(input: FindByIDBookUseCaseInput): Promise<Book> {
    return this.findByIDBookUseCase.execute(input)
  }

  /**
   * Get all books belonging to the authenticated user
   */
  async getAll(input: GetAllBooksUseCaseInput = {}): Promise<Book[]> {
    return this.getAllBooksUseCase.execute(input)
  }

  /**
   * Update an existing book
   */
  async update(input: UpdateBookUseCaseInput): Promise<Book> {
    return this.updateBookUseCase.execute(input)
  }

  /**
   * Convenience method: Create a new book with minimal input
   */
  async createSimple(title: string, summary: string): Promise<Book> {
    return this.create({
      title,
      summary
    })
  }

  /**
   * Convenience method: Update only title and summary, preserving other fields
   */
  async updateBasicInfo(bookId: string, title: string, summary: string): Promise<Book> {
    // First get the current book to preserve existing data
    const currentBook = await this.findByID({id: bookId})

    return this.update({
      id: bookId,
      title,
      summary,
      published: currentBook.isPublished(),
      createdAt: currentBook.getCreatedAt()
    })
  }

  /**
   * Convenience method: Toggle publication status
   */
  async togglePublished(bookId: string): Promise<Book> {
    // First get the current book
    const currentBook = await this.findByID({id: bookId})

    return this.update({
      id: bookId,
      title: currentBook.getTitle(),
      summary: currentBook.getSummary(),
      published: !currentBook.isPublished(),
      createdAt: currentBook.getCreatedAt()
    })
  }

  /**
   * Convenience method: Publish a book
   */
  async publish(bookId: string): Promise<Book> {
    const currentBook = await this.findByID({id: bookId})

    if (currentBook.isPublished()) {
      return currentBook // Already published
    }

    return this.update({
      id: bookId,
      title: currentBook.getTitle(),
      summary: currentBook.getSummary(),
      published: true,
      createdAt: currentBook.getCreatedAt()
    })
  }

  /**
   * Convenience method: Unpublish a book
   */
  async unpublish(bookId: string): Promise<Book> {
    const currentBook = await this.findByID({id: bookId})

    if (!currentBook.isPublished()) {
      return currentBook // Already unpublished
    }

    return this.update({
      id: bookId,
      title: currentBook.getTitle(),
      summary: currentBook.getSummary(),
      published: false,
      createdAt: currentBook.getCreatedAt()
    })
  }
}
