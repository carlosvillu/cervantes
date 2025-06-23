/**
 * BodyService - Public body service interface
 *
 * This service provides a high-level API for all body/content operations.
 * It coordinates between Body Use Cases and Repository implementations.
 */

import type {Body} from '../../domain/body/Body.js'
import type {BodyRepository} from '../../domain/body/BodyRepository.js'
import {
  type CreateBodyUseCaseInput,
  type FindByHashBodyUseCaseInput,
  type FindByIDBodyUseCaseInput,
  type GetAllBodiesUseCaseInput,
  CreateBodyUseCase,
  FindByHashBodyUseCase,
  FindByIDBodyUseCase,
  GetAllBodiesUseCase
} from './usecases/index.js'

export interface BodyServiceConfig {
  repository: BodyRepository
}

export class BodyService {
  private readonly bodyRepository: BodyRepository

  // Use Cases
  private readonly createBodyUseCase: CreateBodyUseCase
  private readonly findByHashBodyUseCase: FindByHashBodyUseCase
  private readonly findByIDBodyUseCase: FindByIDBodyUseCase
  private readonly getAllBodiesUseCase: GetAllBodiesUseCase

  constructor(config: BodyServiceConfig) {
    this.bodyRepository = config.repository

    // Initialize use cases with repository
    this.createBodyUseCase = new CreateBodyUseCase(this.bodyRepository)
    this.findByHashBodyUseCase = new FindByHashBodyUseCase(this.bodyRepository)
    this.findByIDBodyUseCase = new FindByIDBodyUseCase(this.bodyRepository)
    this.getAllBodiesUseCase = new GetAllBodiesUseCase(this.bodyRepository)
  }

  /**
   * Create a new body/content version for a chapter
   * @param input - Body creation data including book, chapter, user IDs and content
   * @returns Promise resolving to the created body with computed hash
   * @throws ValidationError if input data is invalid
   * @throws AuthenticationError if user is not authenticated
   * @throws NetworkError if the request fails
   */
  async create(input: CreateBodyUseCaseInput): Promise<Body> {
    return this.createBodyUseCase.execute(input)
  }

  /**
   * Find a body by its content hash
   * @param input - Hash lookup data
   * @returns Promise resolving to the body if found
   * @throws ValidationError if hash is invalid
   * @throws AuthenticationError if user is not authenticated
   * @throws NetworkError if body not found
   */
  async findByHash(input: FindByHashBodyUseCaseInput): Promise<Body> {
    return this.findByHashBodyUseCase.execute(input)
  }

  /**
   * Find a body by its unique ID
   * @param input - Body ID lookup data
   * @returns Promise resolving to the body if found
   * @throws ValidationError if ID is invalid
   * @throws AuthenticationError if user is not authenticated
   * @throws NetworkError if body not found
   */
  async findByID(input: FindByIDBodyUseCaseInput): Promise<Body> {
    return this.findByIDBodyUseCase.execute(input)
  }

  /**
   * Get all bodies for a specific chapter
   * @param input - Book and chapter identification data
   * @returns Promise resolving to array of bodies for the chapter
   * @throws ValidationError if book or chapter ID is invalid
   * @throws AuthenticationError if user is not authenticated
   * @throws NetworkError if the request fails
   */
  async getAllByChapter(input: GetAllBodiesUseCaseInput): Promise<Body[]> {
    return this.getAllBodiesUseCase.execute(input)
  }

  /**
   * Get the current repository being used by this service
   * @returns The BodyRepository instance
   */
  getRepository(): BodyRepository {
    return this.bodyRepository
  }
}
