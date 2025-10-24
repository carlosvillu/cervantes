import type {Logger} from '../../../domain/_kernel/logger.js'
import type {ClientConfig} from '../../../domain/_kernel/types.js'
import type {HTTPRequestOptions, RequestInterceptor, ResponseInterceptor} from '../types.js'

export class AuthInterceptor {
  private accessToken?: string
  private refreshToken?: string
  private readonly logger: Logger

  constructor(private readonly config: Required<ClientConfig>) {
    this.logger = config.logger
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  clearTokens(): void {
    this.accessToken = undefined
    this.refreshToken = undefined
  }

  getRequestInterceptor(): RequestInterceptor {
    return (url: string, options: HTTPRequestOptions): HTTPRequestOptions => {
      if (!this.accessToken) {
        return options
      }

      return {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    }
  }

  getResponseInterceptor(): ResponseInterceptor {
    return async (response: Response): Promise<void> => {
      // Handle token refresh on 401/403
      if ((response.status === 401 || response.status === 403) && this.refreshToken) {
        await this.attemptTokenRefresh()
      }
    }
  }

  private async attemptTokenRefresh(): Promise<void> {
    if (!this.refreshToken) {
      return
    }

    try {
      const response = await fetch(`${this.config.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh: this.refreshToken
        })
      })

      if (response.ok) {
        const tokens = await response.json()
        this.setTokens(tokens.access, tokens.refresh)

        this.logger.debug('Tokens refreshed successfully')
      } else {
        // Refresh failed, clear tokens
        this.clearTokens()

        this.logger.debug('Token refresh failed, clearing tokens')
      }
    } catch (error) {
      // Network error during refresh, clear tokens
      this.clearTokens()

      this.logger.debug('Token refresh network error, clearing tokens', error)
    }
  }

  hasValidTokens(): boolean {
    return Boolean(this.accessToken && this.refreshToken)
  }

  getAccessToken(): string | undefined {
    return this.accessToken
  }
}
