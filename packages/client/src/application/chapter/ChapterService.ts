/**
 * ChapterService - Public chapter service interface
 *
 * This service provides a high-level API for all chapter operations.
 * It coordinates between Chapter Use Cases and Repository implementations.
 */

import type {Chapter} from '../../domain/chapter/Chapter.js'
import type {ChapterRepository} from '../../domain/chapter/ChapterRepository.js'
import {
  type CreateChapterUseCaseInput,
  type DeleteChapterUseCaseInput,
  type FindByIDChapterUseCaseInput,
  type GetAllChaptersUseCaseInput,
  type UpdateChapterUseCaseInput,
  CreateChapterUseCase,
  DeleteChapterUseCase,
  FindByIDChapterUseCase,
  GetAllChaptersUseCase,
  UpdateChapterUseCase
} from './usecases/index.js'

export interface ChapterServiceConfig {
  repository: ChapterRepository
}

export class ChapterService {
  private readonly chapterRepository: ChapterRepository

  // Use Cases
  private readonly createChapterUseCase: CreateChapterUseCase
  private readonly findByIDChapterUseCase: FindByIDChapterUseCase
  private readonly getAllChaptersUseCase: GetAllChaptersUseCase
  private readonly updateChapterUseCase: UpdateChapterUseCase
  private readonly deleteChapterUseCase: DeleteChapterUseCase

  constructor(config: ChapterServiceConfig) {
    this.chapterRepository = config.repository

    // Initialize Use Cases
    this.createChapterUseCase = new CreateChapterUseCase(this.chapterRepository)
    this.findByIDChapterUseCase = new FindByIDChapterUseCase(this.chapterRepository)
    this.getAllChaptersUseCase = new GetAllChaptersUseCase(this.chapterRepository)
    this.updateChapterUseCase = new UpdateChapterUseCase(this.chapterRepository)
    this.deleteChapterUseCase = new DeleteChapterUseCase(this.chapterRepository)
  }

  /**
   * Create a new chapter
   */
  async create(input: CreateChapterUseCaseInput): Promise<Chapter> {
    return this.createChapterUseCase.execute(input)
  }

  /**
   * Find a chapter by its ID
   */
  async findByID(input: FindByIDChapterUseCaseInput): Promise<Chapter> {
    return this.findByIDChapterUseCase.execute(input)
  }

  /**
   * Get all chapters for a specific book
   */
  async getAllByBookId(input: GetAllChaptersUseCaseInput): Promise<Chapter[]> {
    return this.getAllChaptersUseCase.execute(input)
  }

  /**
   * Update an existing chapter
   */
  async update(input: UpdateChapterUseCaseInput): Promise<Chapter> {
    return this.updateChapterUseCase.execute(input)
  }

  /**
   * Delete a chapter by its ID
   */
  async delete(input: DeleteChapterUseCaseInput): Promise<void> {
    return this.deleteChapterUseCase.execute(input)
  }

  /**
   * Convenience method: Create a new chapter with minimal input
   */
  async createSimple(title: string, summary: string, bookID: string): Promise<Chapter> {
    return this.create({
      title,
      summary,
      bookID
    })
  }

  /**
   * Convenience method: Update only title and summary
   */
  async updateBasicInfo(chapterId: string, title: string, summary: string): Promise<Chapter> {
    // First get the current chapter to preserve existing data
    const currentChapter = await this.findByID({id: chapterId})

    return this.update({
      id: chapterId,
      title,
      summary,
      bookID: currentChapter.getBookID(),
      createdAt: currentChapter.getCreatedAt()
    })
  }

  /**
   * Convenience method: Get all chapters for a book by book ID (string only)
   */
  async getChaptersByBookId(bookId: string): Promise<Chapter[]> {
    return this.getAllByBookId({bookId})
  }

  /**
   * Convenience method: Find chapter by ID (string only)
   */
  async getChapterById(chapterId: string): Promise<Chapter> {
    return this.findByID({id: chapterId})
  }

  /**
   * Convenience method: Delete chapter by ID (string only)
   */
  async deleteChapterById(chapterId: string): Promise<void> {
    return this.delete({id: chapterId})
  }

  /**
   * Utility method: Count chapters for a book
   */
  async getChapterCountForBook(bookId: string): Promise<number> {
    const chapters = await this.getAllByBookId({bookId})
    return chapters.length
  }

  /**
   * Utility method: Get the most recently updated chapter for a book
   */
  async getMostRecentChapterForBook(bookId: string): Promise<Chapter | null> {
    const chapters = await this.getAllByBookId({bookId})

    if (chapters.length === 0) {
      return null
    }

    return chapters.reduce((mostRecent, current) => {
      return current.getUpdatedAt() > mostRecent.getUpdatedAt() ? current : mostRecent
    })
  }

  /**
   * Utility method: Get chapters sorted by creation date
   */
  async getChaptersSortedByDate(bookId: string, ascending = true): Promise<Chapter[]> {
    const chapters = await this.getAllByBookId({bookId})

    return chapters.sort((a, b) => {
      const comparison = a.getCreatedAt() - b.getCreatedAt()
      return ascending ? comparison : -comparison
    })
  }

  /**
   * Utility method: Get chapters sorted by title
   */
  async getChaptersSortedByTitle(bookId: string, ascending = true): Promise<Chapter[]> {
    const chapters = await this.getAllByBookId({bookId})

    return chapters.sort((a, b) => {
      const comparison = a.getTitle().localeCompare(b.getTitle())
      return ascending ? comparison : -comparison
    })
  }
}
