import type {SuccessMessage} from '../_shared/SuccessMessage.js'
import type {CreateLinkRequest} from './CreateLinkRequest.js'
import type {Link} from './Link.js'

export interface LinkRepository {
  /**
   * Create a new link between chapters
   */
  create(input: CreateLinkRequest): Promise<Link>

  /**
   * Find link by ID
   */
  findByID(id: string): Promise<Link | null>

  /**
   * Get all links originating from a specific chapter
   */
  getLinksFromChapter(fromChapterID: string): Promise<Link[]>

  /**
   * Delete a link by ID
   */
  delete(id: string): Promise<SuccessMessage>
}