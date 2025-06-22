/**
 * CreateBodyUseCase - Business logic for body/content creation
 *
 * This use case handles the complete body creation flow including validation,
 * data preparation, and interaction with the body repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import type {Body} from '../../../domain/body/Body.js'
import type {BodyRepository} from '../../../domain/body/BodyRepository.js'
import {CreateBodyRequest} from '../../../domain/body/CreateBodyRequest.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface CreateBodyUseCaseInput {
  bookID: string
  userID: string
  chapterID: string
  content: string
  id?: string
}

export type CreateBodyUseCaseOutput = Body

export class CreateBodyUseCase implements UseCase<CreateBodyUseCaseInput, CreateBodyUseCaseOutput> {
  constructor(private readonly bodyRepository: BodyRepository) {}

  async execute(input: CreateBodyUseCaseInput): Promise<CreateBodyUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create CreateBodyRequest domain object
    const createBodyRequest = input.id
      ? CreateBodyRequest.fromAPI({
          id: input.id,
          bookID: input.bookID,
          userID: input.userID,
          chapterID: input.chapterID,
          content: input.content
        })
      : CreateBodyRequest.create({
          bookID: input.bookID,
          userID: input.userID,
          chapterID: input.chapterID,
          content: input.content
        })

    // Validate the created body request
    const validation = createBodyRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid body data: ${validation.errors.join(', ')}`)
    }

    // Execute body creation through repository
    try {
      return await this.bodyRepository.create(createBodyRequest)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Body creation failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: CreateBodyUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.bookID?.trim()) {
      errors.push('Book ID is required')
    }

    if (!input.userID?.trim()) {
      errors.push('User ID is required')
    }

    if (!input.chapterID?.trim()) {
      errors.push('Chapter ID is required')
    }

    if (input.content === undefined || input.content === null) {
      errors.push('Content is required')
    }

    // Validate ID format (UUID)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (input.bookID && !uuidPattern.test(input.bookID)) {
      errors.push('Book ID must be a valid UUID')
    }

    if (input.userID && !uuidPattern.test(input.userID)) {
      errors.push('User ID must be a valid UUID')
    }

    if (input.chapterID && !uuidPattern.test(input.chapterID)) {
      errors.push('Chapter ID must be a valid UUID')
    }

    if (input.id && !uuidPattern.test(input.id)) {
      errors.push('Body ID must be a valid UUID')
    }

    // Validate content length (reasonable limits)
    if (input.content && input.content.length > 1000000) {
      errors.push('Content must be 1,000,000 characters or less')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid body creation input: ${errors.join(', ')}`)
    }
  }
}
