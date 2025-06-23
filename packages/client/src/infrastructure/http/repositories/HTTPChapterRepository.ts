/**
 * HTTPChapterRepository - HTTP implementation of ChapterRepository
 *
 * This class implements the ChapterRepository interface using HTTP calls through HTTPClient.
 * It handles all chapter-related API operations following Clean Architecture patterns.
 */

import {Chapter, ChapterValidationSchema} from '../../../domain/chapter/Chapter.js'
import type {ChapterRepository} from '../../../domain/chapter/ChapterRepository.js'
import type {CreateChapterRequest} from '../../../domain/chapter/CreateChapterRequest.js'
import type {UpdateChapterRequest} from '../../../domain/chapter/UpdateChapterRequest.js'
import type {HTTPClient} from '../types.js'

export class HTTPChapterRepository implements ChapterRepository {
  constructor(private readonly httpClient: HTTPClient) {}

  async create(request: CreateChapterRequest): Promise<Chapter> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.post('/chapter', {body: requestData}, ChapterValidationSchema)

    if (error) {
      throw error
    }

    return Chapter.fromAPI(
      data as {
        id: string
        userID: string
        bookID: string
        title: string
        summary: string
        createdAt: number
        updatedAt: number
      }
    )
  }

  async findByID(id: string): Promise<Chapter> {
    const [error, data] = await this.httpClient.get(`/chapter/${encodeURIComponent(id)}`, {}, ChapterValidationSchema)

    if (error) {
      throw error
    }

    return Chapter.fromAPI(
      data as {
        id: string
        userID: string
        bookID: string
        title: string
        summary: string
        createdAt: number
        updatedAt: number
      }
    )
  }

  async getAllByBookId(bookId: string): Promise<Chapter[]> {
    const [error, data] = await this.httpClient.get(
      `/chapter?bookID=${encodeURIComponent(bookId)}`,
      {},
      ChapterValidationSchema.array() // Validate as array of chapters
    )

    if (error) {
      throw error
    }

    // Convert array of API data to Chapter domain objects
    const chapters = data as Array<{
      id: string
      userID: string
      bookID: string
      title: string
      summary: string
      createdAt: number
      updatedAt: number
    }>

    return chapters.map(chapterData => Chapter.fromAPI(chapterData))
  }

  async update(id: string, request: UpdateChapterRequest): Promise<Chapter> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.put(
      `/chapter/${encodeURIComponent(id)}`,
      {body: requestData},
      ChapterValidationSchema
    )

    if (error) {
      throw error
    }

    return Chapter.fromAPI(
      data as {
        id: string
        userID: string
        bookID: string
        title: string
        summary: string
        createdAt: number
        updatedAt: number
      }
    )
  }

  async delete(id: string): Promise<void> {
    const [error] = await this.httpClient.delete(`/chapter/${encodeURIComponent(id)}`)

    if (error) {
      throw error
    }

    // DELETE operations typically return void
  }
}
