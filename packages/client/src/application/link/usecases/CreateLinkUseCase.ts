/**
 * CreateLinkUseCase - Business logic for link creation
 *
 * This use case handles the complete link creation flow including validation,
 * data preparation, and interaction with the link repository.
 */

import type {UseCase} from '../../../domain/_kernel/types.js'
import {CreateLinkRequest} from '../../../domain/link/CreateLinkRequest.js'
import type {Link} from '../../../domain/link/Link.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'

export interface CreateLinkUseCaseInput {
  from: string
  to: string
  kind: 'options' | 'direct'
  body: string
  bookID: string
  id?: string
}

export type CreateLinkUseCaseOutput = Link

export class CreateLinkUseCase implements UseCase<CreateLinkUseCaseInput, CreateLinkUseCaseOutput> {
  constructor(private readonly linkRepository: LinkRepository) {}

  async execute(input: CreateLinkUseCaseInput): Promise<CreateLinkUseCaseOutput> {
    // Validate input data
    await this.validateInput(input)

    // Create CreateLinkRequest domain object
    const createLinkRequest = input.id
      ? CreateLinkRequest.fromAPI({
          id: input.id,
          from: input.from,
          to: input.to,
          kind: input.kind,
          body: input.body,
          bookID: input.bookID
        })
      : CreateLinkRequest.create({
          from: input.from,
          to: input.to,
          kind: input.kind,
          body: input.body,
          bookID: input.bookID
        })

    // Validate the created link request
    const validation = createLinkRequest.validate()
    if (!validation.isValid) {
      throw new ValidationError(`Invalid link data: ${validation.errors.join(', ')}`)
    }

    // Execute link creation through repository
    try {
      return await this.linkRepository.create(createLinkRequest)
    } catch (error) {
      // Re-throw repository errors with proper context
      if (error instanceof Error) {
        throw new ValidationError(`Link creation failed: ${error.message}`, error)
      }
      throw error
    }
  }

  private async validateInput(input: CreateLinkUseCaseInput): Promise<void> {
    const errors: string[] = []

    // Validate required fields
    if (!input.from?.trim()) {
      errors.push('From chapter ID is required')
    }

    if (!input.to?.trim()) {
      errors.push('To chapter ID is required')
    }

    if (!input.bookID?.trim()) {
      errors.push('Book ID is required')
    }

    if (!input.kind) {
      errors.push('Link kind is required')
    }

    if (input.body === undefined || input.body === null) {
      errors.push('Link body is required')
    }

    // Validate link kind
    if (input.kind && !['options', 'direct'].includes(input.kind)) {
      errors.push('Link kind must be either "options" or "direct"')
    }

    // Validate self-reference
    if (input.from && input.to && input.from === input.to) {
      errors.push('Link cannot reference itself (from and to cannot be the same)')
    }

    // Validate body length
    if (input.body && input.body.length > 1000) {
      errors.push('Link body must be 1000 characters or less')
    }

    // Validate IDs are valid strings
    if (input.from && input.from.trim().length === 0) {
      errors.push('From chapter ID cannot be empty')
    }

    if (input.to && input.to.trim().length === 0) {
      errors.push('To chapter ID cannot be empty')
    }

    if (input.bookID && input.bookID.trim().length === 0) {
      errors.push('Book ID cannot be empty')
    }

    if (errors.length > 0) {
      throw new ValidationError(`Invalid link creation input: ${errors.join(', ')}`)
    }
  }
}
