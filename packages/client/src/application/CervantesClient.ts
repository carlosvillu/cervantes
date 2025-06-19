/**
 * CervantesClient - Main entry point for the Cervantes TypeScript client
 *
 * This is the primary class that developers will use to interact with the Cervantes API.
 * It follows Clean Architecture principles and provides a unified interface to all services.
 */

import type {ClientConfig} from '../domain/_kernel/types.js'
import {HTTPClient} from '../infrastructure/http/index.js'

export class CervantesClient {
  private readonly config: Required<ClientConfig>
  private readonly httpClient: HTTPClient

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

  /**
   * Set authentication tokens for API requests
   */
  setAuthTokens(accessToken: string, refreshToken: string): void {
    this.httpClient.setAuthTokens(accessToken, refreshToken)
  }

  /**
   * Clear authentication tokens
   */
  clearAuthTokens(): void {
    this.httpClient.clearAuthTokens()
  }

  /**
   * Check if client has valid authentication tokens
   */
  hasValidTokens(): boolean {
    return this.httpClient.hasValidTokens()
  }
}
