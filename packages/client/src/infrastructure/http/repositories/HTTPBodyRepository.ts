/**
 * HTTPBodyRepository - HTTP implementation of BodyRepository
 *
 * This class implements the BodyRepository interface using HTTP calls through HTTPClient.
 * It handles all body/content-related API operations following Clean Architecture patterns.
 */

import {z} from 'zod'

import {Body, BodyValidationSchema} from '../../../domain/body/Body.js'
import type {BodyRepository} from '../../../domain/body/BodyRepository.js'
import type {CreateBodyRequest} from '../../../domain/body/CreateBodyRequest.js'
import type {HTTPClient} from '../types.js'

export class HTTPBodyRepository implements BodyRepository {
  constructor(private readonly httpClient: HTTPClient) {}

  async create(request: CreateBodyRequest): Promise<Body> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.post('/body', {body: requestData}, BodyValidationSchema)

    if (error) {
      throw error
    }

    return Body.fromAPI(
      data as {
        id: string
        userID: string
        bookID: string
        chapterID: string
        content: string
        hash: string
        createdAt: number
      }
    )
  }

  async findByHash(hash: string): Promise<Body> {
    const [error, data] = await this.httpClient.get(`/body?hash=${encodeURIComponent(hash)}`, {}, BodyValidationSchema)

    if (error) {
      throw error
    }

    return Body.fromAPI(
      data as {
        id: string
        userID: string
        bookID: string
        chapterID: string
        content: string
        hash: string
        createdAt: number
      }
    )
  }

  async findByID(id: string): Promise<Body> {
    const [error, data] = await this.httpClient.get(`/body/${id}`, {}, BodyValidationSchema)

    if (error) {
      throw error
    }

    return Body.fromAPI(
      data as {
        id: string
        userID: string
        bookID: string
        chapterID: string
        content: string
        hash: string
        createdAt: number
      }
    )
  }

  async getAllByChapter(bookID: string, chapterID: string): Promise<Body[]> {
    const BodyArraySchema = z.array(BodyValidationSchema)

    const [error, data] = await this.httpClient.get(
      `/body?bookID=${encodeURIComponent(bookID)}&chapterID=${encodeURIComponent(chapterID)}`,
      {},
      BodyArraySchema
    )

    if (error) {
      throw error
    }

    return (
      data as Array<{
        id: string
        userID: string
        bookID: string
        chapterID: string
        content: string
        hash: string
        createdAt: number
      }>
    ).map(bodyData => Body.fromAPI(bodyData))
  }
}
