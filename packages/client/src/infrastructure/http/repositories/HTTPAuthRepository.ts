/**
 * HTTPAuthRepository - HTTP implementation of AuthRepository
 *
 * This class implements the AuthRepository interface using HTTP calls through HTTPClient.
 * It handles all authentication-related API operations following Clean Architecture patterns.
 */

import {SuccessMessage, SuccessMessageValidationSchema} from '../../../domain/_shared/SuccessMessage.js'
import type {AuthRepository} from '../../../domain/auth/AuthRepository.js'
import {AuthTokens, AuthTokensValidationSchema} from '../../../domain/auth/AuthTokens.js'
import type {LoginRequest} from '../../../domain/auth/LoginRequest.js'
import type {RefreshRequest} from '../../../domain/auth/RefreshRequest.js'
import type {SignupRequest} from '../../../domain/auth/SignupRequest.js'
import {ValidationToken, ValidationTokenValidationSchema} from '../../../domain/auth/ValidationToken.js'
import type {HTTPClient} from '../types.js'

export class HTTPAuthRepository implements AuthRepository {
  constructor(private readonly httpClient: HTTPClient) {}

  async signup(request: SignupRequest): Promise<SuccessMessage> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.post(
      '/auth/signup',
      {body: requestData},
      SuccessMessageValidationSchema
    )

    if (error) {
      throw error
    }

    return SuccessMessage.fromAPI(data as {message: string})
  }

  async login(request: LoginRequest): Promise<AuthTokens> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.post('/auth/login', {body: requestData}, AuthTokensValidationSchema)

    if (error) {
      throw error
    }

    // Convert raw data to AuthTokens domain model
    const authTokens = AuthTokens.fromAPI(data as {access: string; refresh: string})

    // Set tokens in HTTP client for future authenticated requests
    this.httpClient.setAuthTokens(authTokens.getAccessToken(), authTokens.getRefreshToken())

    return authTokens
  }

  async refresh(request: RefreshRequest): Promise<AuthTokens> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.post('/auth/refresh', {body: requestData}, AuthTokensValidationSchema)

    if (error) {
      throw error
    }

    // Convert raw data to AuthTokens domain model
    const authTokens = AuthTokens.fromAPI(data as {access: string; refresh: string})

    // Update tokens in HTTP client
    this.httpClient.setAuthTokens(authTokens.getAccessToken(), authTokens.getRefreshToken())

    return authTokens
  }

  async logout(request: RefreshRequest): Promise<SuccessMessage> {
    const requestData = request.toAPI()

    const [error, data] = await this.httpClient.delete(
      '/auth/refresh',
      {body: requestData},
      SuccessMessageValidationSchema
    )

    if (error) {
      throw error
    }

    // Clear tokens from HTTP client
    this.httpClient.clearAuthTokens()

    return SuccessMessage.fromAPI(data as {message: string})
  }

  async sendValidationCode(): Promise<ValidationToken> {
    const [error, data] = await this.httpClient.post('/auth/validationToken', {}, ValidationTokenValidationSchema)

    if (error) {
      throw error
    }

    return ValidationToken.fromAPI(
      data as {id: string; userID: string; code?: string; createdAt: number; validatedAt?: number | null}
    )
  }

  async verifyEmail(validationTokenId: string, code: string): Promise<SuccessMessage> {
    const url = `/auth/validationToken/${validationTokenId}?code=${encodeURIComponent(code)}`

    const [error, data] = await this.httpClient.post(url, {}, SuccessMessageValidationSchema)

    if (error) {
      throw error
    }

    return SuccessMessage.fromAPI(data as {message: string})
  }

  async getValidationToken(validationTokenId: string): Promise<ValidationToken> {
    const [error, data] = await this.httpClient.get(
      `/auth/validationToken/${validationTokenId}`,
      {},
      ValidationTokenValidationSchema
    )

    if (error) {
      throw error
    }

    return ValidationToken.fromAPI(
      data as {id: string; userID: string; code?: string; createdAt: number; validatedAt?: number | null}
    )
  }
}
