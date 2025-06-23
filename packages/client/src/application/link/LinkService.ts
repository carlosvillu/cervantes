/**
 * LinkService - Public link service interface
 *
 * This service provides a high-level API for all link operations.
 * It coordinates between Link Use Cases and Repository implementations.
 */

import type {SuccessMessage} from '../../domain/_shared/SuccessMessage.js'
import type {Link} from '../../domain/link/Link.js'
import type {LinkRepository} from '../../domain/link/LinkRepository.js'
import {
  type CreateLinkUseCaseInput,
  type DeleteLinkUseCaseInput,
  type FindByIDLinkUseCaseInput,
  type GetLinksFromChapterUseCaseInput,
  CreateLinkUseCase,
  DeleteLinkUseCase,
  FindByIDLinkUseCase,
  GetLinksFromChapterUseCase
} from './usecases/index.js'

export interface LinkServiceConfig {
  repository: LinkRepository
}

export class LinkService {
  private readonly linkRepository: LinkRepository

  // Use Cases
  private readonly createLinkUseCase: CreateLinkUseCase
  private readonly findByIDLinkUseCase: FindByIDLinkUseCase
  private readonly getLinksFromChapterUseCase: GetLinksFromChapterUseCase
  private readonly deleteLinkUseCase: DeleteLinkUseCase

  constructor(config: LinkServiceConfig) {
    this.linkRepository = config.repository

    // Initialize Use Cases
    this.createLinkUseCase = new CreateLinkUseCase(this.linkRepository)
    this.findByIDLinkUseCase = new FindByIDLinkUseCase(this.linkRepository)
    this.getLinksFromChapterUseCase = new GetLinksFromChapterUseCase(this.linkRepository)
    this.deleteLinkUseCase = new DeleteLinkUseCase(this.linkRepository)
  }

  /**
   * Create a new link between chapters
   */
  async create(input: CreateLinkUseCaseInput): Promise<Link> {
    return this.createLinkUseCase.execute(input)
  }

  /**
   * Find a link by its ID
   */
  async findByID(input: FindByIDLinkUseCaseInput): Promise<Link | null> {
    return this.findByIDLinkUseCase.execute(input)
  }

  /**
   * Get all links originating from a specific chapter
   */
  async getLinksFromChapter(input: GetLinksFromChapterUseCaseInput): Promise<Link[]> {
    return this.getLinksFromChapterUseCase.execute(input)
  }

  /**
   * Delete a link by its ID
   */
  async delete(input: DeleteLinkUseCaseInput): Promise<SuccessMessage> {
    return this.deleteLinkUseCase.execute(input)
  }

  /**
   * Convenience method: Create a simple options link between chapters
   */
  async createOptionsLink(fromChapterID: string, toChapterID: string, linkText: string, bookID: string): Promise<Link> {
    return this.create({
      from: fromChapterID,
      to: toChapterID,
      kind: 'options',
      body: linkText,
      bookID
    })
  }

  /**
   * Convenience method: Create a direct link between chapters
   */
  async createDirectLink(fromChapterID: string, toChapterID: string, linkText: string, bookID: string): Promise<Link> {
    return this.create({
      from: fromChapterID,
      to: toChapterID,
      kind: 'direct',
      body: linkText,
      bookID
    })
  }

  /**
   * Convenience method: Get all option-type links from a chapter
   */
  async getOptionsFromChapter(fromChapterID: string): Promise<Link[]> {
    const allLinks = await this.getLinksFromChapter({fromChapterID})
    return allLinks.filter(link => link.isOptionsLink())
  }

  /**
   * Convenience method: Get all direct-type links from a chapter
   */
  async getDirectLinksFromChapter(fromChapterID: string): Promise<Link[]> {
    const allLinks = await this.getLinksFromChapter({fromChapterID})
    return allLinks.filter(link => link.isDirectLink())
  }

  /**
   * Convenience method: Get all links from a chapter that have descriptions
   */
  async getLinksWithDescriptionsFromChapter(fromChapterID: string): Promise<Link[]> {
    const allLinks = await this.getLinksFromChapter({fromChapterID})
    return allLinks.filter(link => link.hasDescription())
  }

  /**
   * Convenience method: Check if a link exists by ID
   */
  async exists(linkID: string): Promise<boolean> {
    const link = await this.findByID({id: linkID})
    return link !== null
  }

  /**
   * Convenience method: Delete a link and return boolean success status
   */
  async deleteAndConfirm(linkID: string): Promise<boolean> {
    try {
      await this.delete({id: linkID})
      return true
    } catch {
      return false
    }
  }
}
