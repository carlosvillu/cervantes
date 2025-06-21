/**
 * AuthService - Public authentication service interface
 *
 * This service provides a high-level API for all authentication operations.
 * It coordinates between Use Cases, TokenManager, and Repository implementations.
 */

import type {SuccessMessage} from '../../domain/_shared/SuccessMessage.js'
import type {AuthRepository} from '../../domain/auth/AuthRepository.js'
import type {AuthTokens} from '../../domain/auth/AuthTokens.js'
import type {ValidationToken} from '../../domain/auth/ValidationToken.js'
import {
  type LoginAuthUseCaseInput,
  type SignupAuthUseCaseInput,
  type VerifyEmailAuthUseCaseInput,
  LoginAuthUseCase,
  LogoutAuthUseCase,
  RefreshTokenAuthUseCase,
  SendValidationCodeAuthUseCase,
  SignupAuthUseCase,
  VerifyEmailAuthUseCase
} from './usecases/index.js'
import {type AuthStateChangeListener, type TokenManagerConfig, AuthState, TokenManager} from './TokenManager.js'

export interface AuthServiceConfig {
  repository: AuthRepository
  tokenManager?: TokenManagerConfig
}

export class AuthService {
  private readonly authRepository: AuthRepository
  private readonly tokenManager: TokenManager

  // Use Cases
  private readonly signupUseCase: SignupAuthUseCase
  private readonly loginUseCase: LoginAuthUseCase
  private readonly refreshTokenUseCase: RefreshTokenAuthUseCase
  private readonly logoutUseCase: LogoutAuthUseCase
  private readonly sendValidationCodeUseCase: SendValidationCodeAuthUseCase
  private readonly verifyEmailUseCase: VerifyEmailAuthUseCase

  constructor(config: AuthServiceConfig) {
    this.authRepository = config.repository

    // Initialize Use Cases
    this.signupUseCase = new SignupAuthUseCase(this.authRepository)
    this.loginUseCase = new LoginAuthUseCase(this.authRepository)
    this.refreshTokenUseCase = new RefreshTokenAuthUseCase(this.authRepository)
    this.logoutUseCase = new LogoutAuthUseCase(this.authRepository)
    this.sendValidationCodeUseCase = new SendValidationCodeAuthUseCase(this.authRepository)
    this.verifyEmailUseCase = new VerifyEmailAuthUseCase(this.authRepository)

    // Initialize TokenManager with auto-refresh callback
    this.tokenManager = new TokenManager({
      ...config.tokenManager,
      autoRefreshCallback: async (refreshToken: string) => {
        return this.refreshTokenUseCase.execute({refreshToken})
      }
    })

    // Set up automatic token refresh
    this.setupAutoRefresh()
  }

  /**
   * Register a new user account
   */
  async signup(input: SignupAuthUseCaseInput): Promise<SuccessMessage> {
    return this.signupUseCase.execute(input)
  }

  /**
   * Authenticate user and establish session
   */
  async login(input: LoginAuthUseCaseInput): Promise<AuthTokens> {
    const tokens = await this.loginUseCase.execute(input)
    await this.tokenManager.setTokens(tokens)
    return tokens
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<AuthTokens> {
    const currentTokens = this.tokenManager.getTokens()
    if (!currentTokens) {
      throw new Error('No tokens available for refresh')
    }

    return this.tokenManager.refreshTokens(async refreshToken => {
      return this.refreshTokenUseCase.execute({refreshToken})
    })
  }

  /**
   * Logout user and clear session
   */
  async logout(): Promise<SuccessMessage> {
    const currentTokens = this.tokenManager.getTokens()
    if (!currentTokens) {
      throw new Error('No active session to logout')
    }

    const result = await this.logoutUseCase.execute({
      refreshToken: currentTokens.getRefreshToken()
    })

    await this.tokenManager.clearTokens()
    return result
  }

  /**
   * Send email validation code to authenticated user
   */
  async sendValidationCode(): Promise<ValidationToken> {
    this.ensureAuthenticated()
    return this.sendValidationCodeUseCase.execute({})
  }

  /**
   * Verify email using validation code
   */
  async verifyEmail(input: VerifyEmailAuthUseCaseInput): Promise<SuccessMessage> {
    this.ensureAuthenticated()
    return this.verifyEmailUseCase.execute(input)
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    return this.tokenManager.getState()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated()
  }

  /**
   * Get current authentication tokens
   */
  getCurrentTokens(): AuthTokens | null {
    return this.tokenManager.getTokens()
  }

  /**
   * Get current access token for API requests
   */
  getAccessToken(): string | null {
    const tokens = this.tokenManager.getTokens()
    return tokens ? tokens.getAccessToken() : null
  }

  /**
   * Check if tokens need refresh
   */
  needsRefresh(): boolean {
    return this.tokenManager.needsRefresh()
  }

  /**
   * Add authentication state change listener
   */
  onAuthStateChange(listener: AuthStateChangeListener): void {
    this.tokenManager.addStateChangeListener(listener)
  }

  /**
   * Remove authentication state change listener
   */
  offAuthStateChange(listener: AuthStateChangeListener): void {
    this.tokenManager.removeStateChangeListener(listener)
  }

  /**
   * Dispose of the service and cleanup resources
   */
  dispose(): void {
    this.tokenManager.dispose()
  }

  private ensureAuthenticated(): void {
    if (!this.isAuthenticated()) {
      throw new Error('User must be authenticated to perform this action')
    }
  }

  private setupAutoRefresh(): void {
    // Listen for token state changes for logging and monitoring
    this.tokenManager.addStateChangeListener(event => {
      if (event.currentState === AuthState.EXPIRED) {
        // Tokens have expired - auto-refresh is handled by TokenManager
        // This is mainly for logging and external monitoring
        console.warn('Authentication tokens have expired') // eslint-disable-line no-console
      }
    })
  }
}
