/**
 * AuthRepository - Domain interface for authentication operations
 *
 * This interface defines the contract that all authentication repositories must implement.
 * It follows the Repository pattern from Clean Architecture, abstracting the data layer
 * from the business logic.
 */

import type {SuccessMessage} from '../_shared/SuccessMessage.js'
import type {AuthTokens} from './AuthTokens.js'
import type {LoginRequest} from './LoginRequest.js'
import type {RefreshRequest} from './RefreshRequest.js'
import type {SignupRequest} from './SignupRequest.js'
import type {ValidationToken} from './ValidationToken.js'

export interface AuthRepository {
  /**
   * Register a new user account
   * @param request - User registration data
   * @returns Success message on successful registration
   * @throws AuthenticationError if registration fails
   */
  signup: (request: SignupRequest) => Promise<SuccessMessage>

  /**
   * Authenticate user credentials and return tokens
   * @param request - User login credentials
   * @returns Authentication tokens (access + refresh)
   * @throws AuthenticationError if credentials are invalid
   */
  login: (request: LoginRequest) => Promise<AuthTokens>

  /**
   * Refresh access token using refresh token
   * @param request - Refresh token request
   * @returns New authentication tokens
   * @throws AuthenticationError if refresh token is invalid
   */
  refresh: (request: RefreshRequest) => Promise<AuthTokens>

  /**
   * Logout user and invalidate refresh token
   * @param request - Refresh token to invalidate
   * @returns Success message on successful logout
   * @throws AuthenticationError if refresh token is invalid
   */
  logout: (request: RefreshRequest) => Promise<SuccessMessage>

  /**
   * Send email validation code to authenticated user
   * @returns ValidationToken containing code and metadata
   * @throws AuthenticationError if user is not authenticated
   */
  sendValidationCode: () => Promise<ValidationToken>

  /**
   * Verify email validation code
   * @param validationTokenId - ID of the validation token
   * @param code - Validation code to verify
   * @returns Success message on successful verification
   * @throws AuthenticationError if code is invalid or expired
   */
  verifyEmail: (validationTokenId: string, code: string) => Promise<SuccessMessage>

  /**
   * Get validation token details
   * @param validationTokenId - ID of the validation token
   * @returns ValidationToken with current status
   * @throws AuthenticationError if token not found or user not authenticated
   */
  getValidationToken: (validationTokenId: string) => Promise<ValidationToken>
}
