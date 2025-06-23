/**
 * CervantesClient - Main entry point for the Cervantes TypeScript client
 *
 * This is the primary class that developers will use to interact with the Cervantes API.
 * It follows Clean Architecture principles and provides a unified interface to all services.
 */

import type {ClientConfig} from '../domain/_kernel/types.js'
import type {SuccessMessage} from '../domain/_shared/SuccessMessage.js'
import type {AuthTokens} from '../domain/auth/AuthTokens.js'
import type {ValidationToken} from '../domain/auth/ValidationToken.js'
import type {Body} from '../domain/body/Body.js'
import type {Book} from '../domain/book/Book.js'
import type {Chapter} from '../domain/chapter/Chapter.js'
import type {Link} from '../domain/link/Link.js'
import type {User} from '../domain/user/User.js'
import {
  HTTPAuthRepository,
  HTTPBodyRepository,
  HTTPBookRepository,
  HTTPChapterRepository,
  HTTPClient,
  HTTPLinkRepository,
  HTTPUserRepository
} from '../infrastructure/http/index.js'
import {LocalStorageAdapter} from '../infrastructure/storage/index.js'
import {
  type AuthStateChangeListener,
  type LoginAuthUseCaseInput,
  type SignupAuthUseCaseInput,
  type VerifyEmailAuthUseCaseInput,
  AuthService,
  AuthState
} from './auth/index.js'
import {
  type CreateBodyUseCaseInput,
  type FindByHashBodyUseCaseInput,
  type FindByIDBodyUseCaseInput,
  type GetAllBodiesUseCaseInput,
  BodyService
} from './body/index.js'
import {
  type CreateBookUseCaseInput,
  type FindByIDBookUseCaseInput,
  type GetAllBooksUseCaseInput,
  type UpdateBookUseCaseInput,
  BookService
} from './book/index.js'
import {
  type CreateChapterUseCaseInput,
  type DeleteChapterUseCaseInput,
  type FindByIDChapterUseCaseInput,
  type GetAllChaptersUseCaseInput,
  type UpdateChapterUseCaseInput,
  ChapterService
} from './chapter/index.js'
import {
  type CreateLinkUseCaseInput,
  type DeleteLinkUseCaseInput,
  type FindByIDLinkUseCaseInput,
  type GetLinksFromChapterUseCaseInput,
  LinkService
} from './link/index.js'
import {type GetCurrentUserUseCaseInput, UserService} from './user/index.js'

export class CervantesClient {
  private readonly config: Required<ClientConfig>
  private readonly httpClient: HTTPClient
  private readonly authService: AuthService
  private readonly bookService: BookService
  private readonly bodyService: BodyService
  private readonly chapterService: ChapterService
  private readonly linkService: LinkService
  private readonly userService: UserService

  constructor(config: ClientConfig = {}) {
    // Set default configuration
    this.config = {
      baseURL: config.baseURL ?? 'https://api.bookadventur.es',
      apiKey: config.apiKey ?? '',
      timeout: config.timeout ?? 30000,
      retries: config.retries ?? 3,
      debug: config.debug ?? false
    }

    // Initialize HTTP client
    this.httpClient = new HTTPClient(this.config)

    // Initialize Auth service
    const authRepository = new HTTPAuthRepository(this.httpClient)
    const storage = new LocalStorageAdapter()

    this.authService = new AuthService({
      repository: authRepository,
      tokenManager: {
        storage: storage.isStorageAvailable() ? storage : undefined,
        storagePrefix: 'cervantes_auth_',
        autoRefresh: true,
        refreshThresholdMs: 5 * 60 * 1000 // 5 minutes
      }
    })

    // Initialize Book service
    const bookRepository = new HTTPBookRepository(this.httpClient)
    this.bookService = new BookService({
      repository: bookRepository
    })

    // Initialize Body service
    const bodyRepository = new HTTPBodyRepository(this.httpClient)
    this.bodyService = new BodyService({
      repository: bodyRepository
    })

    // Initialize Chapter service
    const chapterRepository = new HTTPChapterRepository(this.httpClient)
    this.chapterService = new ChapterService({
      repository: chapterRepository
    })

    // Initialize Link service
    const linkRepository = new HTTPLinkRepository(this.httpClient)
    this.linkService = new LinkService({
      repository: linkRepository
    })

    // Initialize User service
    const userRepository = new HTTPUserRepository(this.httpClient)
    this.userService = new UserService({
      repository: userRepository
    })

    if (this.config.debug) {
      console.log('CervantesClient initialized with config:', this.config) // eslint-disable-line no-console
    }
  }

  /**
   * Get the current client configuration
   */
  getConfig(): Required<ClientConfig> {
    return {...this.config}
  }

  /**
   * Check if the client is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.config.baseURL)
  }

  /**
   * Get client version
   */
  getVersion(): string {
    return '0.1.0'
  }

  /**
   * Get the HTTP client instance for advanced usage
   */
  getHTTPClient(): HTTPClient {
    return this.httpClient
  }

  // ============================================================================
  // Authentication Methods
  // ============================================================================

  /**
   * Register a new user account
   */
  async signup(input: SignupAuthUseCaseInput): Promise<SuccessMessage> {
    return this.authService.signup(input)
  }

  /**
   * Authenticate user and establish session
   */
  async login(input: LoginAuthUseCaseInput): Promise<AuthTokens> {
    return this.authService.login(input)
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<AuthTokens> {
    return this.authService.refreshTokens()
  }

  /**
   * Logout user and clear session
   */
  async logout(): Promise<SuccessMessage> {
    return this.authService.logout()
  }

  /**
   * Send email validation code to authenticated user
   */
  async sendValidationCode(): Promise<ValidationToken> {
    return this.authService.sendValidationCode()
  }

  /**
   * Verify email using validation code
   */
  async verifyEmail(input: VerifyEmailAuthUseCaseInput): Promise<SuccessMessage> {
    return this.authService.verifyEmail(input)
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    return this.authService.getAuthState()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated()
  }

  /**
   * Get current authentication tokens
   */
  getCurrentTokens(): AuthTokens | null {
    return this.authService.getCurrentTokens()
  }

  /**
   * Get current access token for API requests
   */
  getAccessToken(): string | null {
    return this.authService.getAccessToken()
  }

  /**
   * Check if tokens need refresh
   */
  needsRefresh(): boolean {
    return this.authService.needsRefresh()
  }

  /**
   * Add authentication state change listener
   */
  onAuthStateChange(listener: AuthStateChangeListener): void {
    this.authService.onAuthStateChange(listener)
  }

  /**
   * Remove authentication state change listener
   */
  offAuthStateChange(listener: AuthStateChangeListener): void {
    this.authService.offAuthStateChange(listener)
  }

  // ============================================================================
  // Legacy Token Management (for backward compatibility)
  // ============================================================================

  /**
   * Set authentication tokens for API requests
   * @deprecated Use login() method instead
   */
  setAuthTokens(accessToken: string, refreshToken: string): void {
    this.httpClient.setAuthTokens(accessToken, refreshToken)
  }

  /**
   * Clear authentication tokens
   * @deprecated Use logout() method instead
   */
  clearAuthTokens(): void {
    this.httpClient.clearAuthTokens()
  }

  /**
   * Check if client has valid authentication tokens
   * @deprecated Use isAuthenticated() method instead
   */
  hasValidTokens(): boolean {
    return this.httpClient.hasValidTokens()
  }

  // ============================================================================
  // Book Management Methods
  // ============================================================================

  /**
   * Create a new book
   */
  async createBook(input: CreateBookUseCaseInput): Promise<Book> {
    return this.bookService.create(input)
  }

  /**
   * Find a book by its ID
   */
  async findBookByID(input: FindByIDBookUseCaseInput): Promise<Book> {
    return this.bookService.findByID(input)
  }

  /**
   * Get all books belonging to the authenticated user
   */
  async getAllBooks(input: GetAllBooksUseCaseInput = {}): Promise<Book[]> {
    return this.bookService.getAll(input)
  }

  /**
   * Update an existing book
   */
  async updateBook(input: UpdateBookUseCaseInput): Promise<Book> {
    return this.bookService.update(input)
  }

  /**
   * Convenience method: Create a new book with minimal input
   */
  async createSimpleBook(title: string, summary: string): Promise<Book> {
    return this.bookService.createSimple(title, summary)
  }

  /**
   * Convenience method: Update only title and summary, preserving other fields
   */
  async updateBookBasicInfo(bookId: string, title: string, summary: string): Promise<Book> {
    return this.bookService.updateBasicInfo(bookId, title, summary)
  }

  /**
   * Convenience method: Toggle publication status
   */
  async toggleBookPublished(bookId: string): Promise<Book> {
    return this.bookService.togglePublished(bookId)
  }

  /**
   * Convenience method: Publish a book
   */
  async publishBook(bookId: string): Promise<Book> {
    return this.bookService.publish(bookId)
  }

  /**
   * Convenience method: Unpublish a book
   */
  async unpublishBook(bookId: string): Promise<Book> {
    return this.bookService.unpublish(bookId)
  }

  /**
   * Get the BookService instance for advanced usage
   */
  getBookService(): BookService {
    return this.bookService
  }

  // ============================================================================
  // Body/Content Management Methods
  // ============================================================================

  /**
   * Create a new body/content version for a chapter
   */
  async createBody(input: CreateBodyUseCaseInput): Promise<Body> {
    return this.bodyService.create(input)
  }

  /**
   * Find a body by its content hash
   */
  async findBodyByHash(input: FindByHashBodyUseCaseInput): Promise<Body> {
    return this.bodyService.findByHash(input)
  }

  /**
   * Find a body by its unique ID
   */
  async findBodyByID(input: FindByIDBodyUseCaseInput): Promise<Body> {
    return this.bodyService.findByID(input)
  }

  /**
   * Get all bodies for a specific chapter
   */
  async getAllBodiesByChapter(input: GetAllBodiesUseCaseInput): Promise<Body[]> {
    return this.bodyService.getAllByChapter(input)
  }

  /**
   * Convenience method: Create a simple body with minimal input
   */
  async createSimpleBody(bookID: string, userID: string, chapterID: string, content: string): Promise<Body> {
    return this.bodyService.create({
      bookID,
      userID,
      chapterID,
      content
    })
  }

  /**
   * Get the BodyService instance for advanced usage
   */
  getBodyService(): BodyService {
    return this.bodyService
  }

  // ============================================================================
  // Chapter Management Methods
  // ============================================================================

  /**
   * Create a new chapter
   */
  async createChapter(input: CreateChapterUseCaseInput): Promise<Chapter> {
    return this.chapterService.create(input)
  }

  /**
   * Find a chapter by its ID
   */
  async findChapterByID(input: FindByIDChapterUseCaseInput): Promise<Chapter> {
    return this.chapterService.findByID(input)
  }

  /**
   * Get all chapters for a specific book
   */
  async getAllChaptersByBookId(input: GetAllChaptersUseCaseInput): Promise<Chapter[]> {
    return this.chapterService.getAllByBookId(input)
  }

  /**
   * Update an existing chapter
   */
  async updateChapter(input: UpdateChapterUseCaseInput): Promise<Chapter> {
    return this.chapterService.update(input)
  }

  /**
   * Delete a chapter by its ID
   */
  async deleteChapter(input: DeleteChapterUseCaseInput): Promise<void> {
    return this.chapterService.delete(input)
  }

  /**
   * Convenience method: Create a new chapter with minimal input
   */
  async createSimpleChapter(title: string, summary: string, bookID: string): Promise<Chapter> {
    return this.chapterService.createSimple(title, summary, bookID)
  }

  /**
   * Convenience method: Update only title and summary
   */
  async updateChapterBasicInfo(chapterId: string, title: string, summary: string): Promise<Chapter> {
    return this.chapterService.updateBasicInfo(chapterId, title, summary)
  }

  /**
   * Convenience method: Get all chapters for a book by book ID (string only)
   */
  async getChaptersByBookId(bookId: string): Promise<Chapter[]> {
    return this.chapterService.getChaptersByBookId(bookId)
  }

  /**
   * Convenience method: Find chapter by ID (string only)
   */
  async getChapterById(chapterId: string): Promise<Chapter> {
    return this.chapterService.getChapterById(chapterId)
  }

  /**
   * Convenience method: Delete chapter by ID (string only)
   */
  async deleteChapterById(chapterId: string): Promise<void> {
    return this.chapterService.deleteChapterById(chapterId)
  }

  /**
   * Utility method: Count chapters for a book
   */
  async getChapterCountForBook(bookId: string): Promise<number> {
    return this.chapterService.getChapterCountForBook(bookId)
  }

  /**
   * Utility method: Get the most recently updated chapter for a book
   */
  async getMostRecentChapterForBook(bookId: string): Promise<Chapter | null> {
    return this.chapterService.getMostRecentChapterForBook(bookId)
  }

  /**
   * Utility method: Get chapters sorted by creation date
   */
  async getChaptersSortedByDate(bookId: string, ascending = true): Promise<Chapter[]> {
    return this.chapterService.getChaptersSortedByDate(bookId, ascending)
  }

  /**
   * Utility method: Get chapters sorted by title
   */
  async getChaptersSortedByTitle(bookId: string, ascending = true): Promise<Chapter[]> {
    return this.chapterService.getChaptersSortedByTitle(bookId, ascending)
  }

  /**
   * Get the ChapterService instance for advanced usage
   */
  getChapterService(): ChapterService {
    return this.chapterService
  }

  // ============================================================================
  // Link Management Methods
  // ============================================================================

  /**
   * Create a new link between chapters
   */
  async createLink(input: CreateLinkUseCaseInput): Promise<Link> {
    return this.linkService.create(input)
  }

  /**
   * Find a link by its ID
   */
  async findLinkByID(input: FindByIDLinkUseCaseInput): Promise<Link | null> {
    return this.linkService.findByID(input)
  }

  /**
   * Get all links originating from a specific chapter
   */
  async getLinksFromChapter(input: GetLinksFromChapterUseCaseInput): Promise<Link[]> {
    return this.linkService.getLinksFromChapter(input)
  }

  /**
   * Delete a link by its ID
   */
  async deleteLink(input: DeleteLinkUseCaseInput): Promise<SuccessMessage> {
    return this.linkService.delete(input)
  }

  /**
   * Convenience method: Create a simple options link between chapters
   */
  async createOptionsLink(
    fromChapterID: string,
    toChapterID: string,
    linkText: string,
    bookID: string
  ): Promise<Link> {
    return this.linkService.createOptionsLink(fromChapterID, toChapterID, linkText, bookID)
  }

  /**
   * Convenience method: Create a direct link between chapters
   */
  async createDirectLink(
    fromChapterID: string,
    toChapterID: string,
    linkText: string,
    bookID: string
  ): Promise<Link> {
    return this.linkService.createDirectLink(fromChapterID, toChapterID, linkText, bookID)
  }

  /**
   * Get the LinkService instance for advanced usage
   */
  getLinkService(): LinkService {
    return this.linkService
  }

  // ============================================================================
  // User Management Methods
  // ============================================================================

  /**
   * Get current authenticated user
   */
  async getCurrentUser(input: GetCurrentUserUseCaseInput = {}): Promise<User> {
    return this.userService.getCurrentUser(input)
  }

  /**
   * Convenience method: Get current user information
   */
  async getCurrentUserInfo(): Promise<User> {
    return this.userService.getCurrentUserInfo()
  }

  /**
   * Convenience method: Check if current user is verified
   */
  async isCurrentUserVerified(): Promise<boolean> {
    return this.userService.isCurrentUserVerified()
  }

  /**
   * Convenience method: Get current user permissions
   */
  async getCurrentUserPermissions(): Promise<{
    canCreateBooks: boolean
    canPublishBooks: boolean
    canUploadImages: boolean
    canGenerateImages: boolean
  }> {
    return this.userService.getCurrentUserPermissions()
  }

  /**
   * Convenience method: Get user profile information
   */
  async getCurrentUserProfile(): Promise<{
    id: string
    username: string
    email: string
    verified: boolean
    displayName: string
  }> {
    return this.userService.getCurrentUserProfile()
  }

  /**
   * Get the UserService instance for advanced usage
   */
  getUserService(): UserService {
    return this.userService
  }

  // ============================================================================
  // Cleanup
  // ============================================================================

  /**
   * Dispose of the client and cleanup resources
   */
  dispose(): void {
    this.authService.dispose()
  }
}
