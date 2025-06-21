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
import {HTTPAuthRepository, HTTPClient} from '../infrastructure/http/index.js'
import {LocalStorageAdapter} from '../infrastructure/storage/index.js'
import {
  type AuthStateChangeListener,
  type LoginAuthUseCaseInput,
  type SignupAuthUseCaseInput,
  type VerifyEmailAuthUseCaseInput,
  AuthService,
  AuthState
} from './auth/index.js'

export class CervantesClient {
  private readonly config: Required<ClientConfig>
  private readonly httpClient: HTTPClient
  private readonly authService: AuthService

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
  // Cleanup
  // ============================================================================

  /**
   * Dispose of the client and cleanup resources
   */
  dispose(): void {
    this.authService.dispose()
  }
}
