/**
 * HTTPLinkRepository - HTTP implementation of LinkRepository
 *
 * This class implements the LinkRepository interface using HTTP calls through HTTPClient.
 * It handles all link-related API operations following Clean Architecture patterns.
 */

import {SuccessMessage, SuccessMessageValidationSchema} from '../../../domain/_shared/SuccessMessage.js'
import type {CreateLinkRequest} from '../../../domain/link/CreateLinkRequest.js'
import {Link, LinkValidationSchema} from '../../../domain/link/Link.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import type {HTTPClient} from '../types.js'

export class HTTPLinkRepository implements LinkRepository {
  constructor(private readonly httpClient: HTTPClient) {}

  async create(request: CreateLinkRequest): Promise<Link> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.post('/link', {body: requestData}, LinkValidationSchema)

    if (error) {
      throw error
    }

    return Link.fromAPI(
      data as {
        id: string
        userID: string
        bookID: string
        from: string
        to: string
        kind: 'options' | 'direct'
        body: string
        createdAt: number
      }
    )
  }

  async findByID(id: string): Promise<Link | null> {
    const [error, data] = await this.httpClient.get(`/link/${encodeURIComponent(id)}`, {}, LinkValidationSchema)

    if (error) {
      // If link not found (404), return null instead of throwing
      if (error.name === 'ServerError' && error.message.includes('404')) {
        return null
      }
      throw error
    }

    return Link.fromAPI(
      data as {
        id: string
        userID: string
        bookID: string
        from: string
        to: string
        kind: 'options' | 'direct'
        body: string
        createdAt: number
      }
    )
  }

  async getLinksFromChapter(fromChapterID: string): Promise<Link[]> {
    const [error, data] = await this.httpClient.get(
      '/link',
      {params: {from: fromChapterID}},
      LinkValidationSchema.array() // Validate as array of links
    )

    if (error) {
      throw error
    }

    // Convert array of API data to Link domain objects
    const links = data as Array<{
      id: string
      userID: string
      bookID: string
      from: string
      to: string
      kind: 'options' | 'direct'
      body: string
      createdAt: number
    }>

    return links.map(linkData => Link.fromAPI(linkData))
  }

  async delete(id: string): Promise<SuccessMessage> {
    const [error, data] = await this.httpClient.delete(
      `/link/${encodeURIComponent(id)}`,
      {},
      SuccessMessageValidationSchema
    )

    if (error) {
      throw error
    }

    return SuccessMessage.fromAPI(data as {message: string})
  }
}