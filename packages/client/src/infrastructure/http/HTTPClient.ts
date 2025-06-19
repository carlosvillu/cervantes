/**
 * HTTPClient - Core HTTP client implementation
 *
 * Based on the project's Fetcher pattern with domain error mapping,
 * retry logic, and interceptor support.
 */

import type {AnyZodObject, ZodArray} from 'zod'
import {ZodError} from 'zod'

import type {ClientConfig} from '../../domain/_kernel/types.js'
import {NetworkError, ValidationError} from './errors/index.js'
import {AuthInterceptor, ErrorInterceptor} from './interceptors/index.js'
import type {HTTPClient, HTTPRequestOptions, HTTPResponse, RetryConfig} from './types.js'

export class HTTPClientImpl implements HTTPClient {
  private readonly authInterceptor: AuthInterceptor
  private readonly errorInterceptor: ErrorInterceptor
  private readonly retryConfig: RetryConfig

  constructor(private readonly config: Required<ClientConfig>) {
    this.authInterceptor = new AuthInterceptor(config)
    this.errorInterceptor = new ErrorInterceptor(config.debug)

    // Default retry configuration
    this.retryConfig = {
      maxAttempts: config.retries,
      baseDelay: 1000,
      maxDelay: 10000,
      retryCondition: (error: Error, attempt: number): boolean => {
        // Retry network errors and retryable server errors
        if (error instanceof NetworkError) return true
        if (error.message.includes('ServerError') && attempt < this.retryConfig.maxAttempts) return true
        return false
      }
    }
  }

  // Auth token management
  setAuthTokens(accessToken: string, refreshToken: string): void {
    this.authInterceptor.setTokens(accessToken, refreshToken)
  }

  clearAuthTokens(): void {
    this.authInterceptor.clearTokens()
  }

  hasValidTokens(): boolean {
    return this.authInterceptor.hasValidTokens()
  }

  async get<T>(
    url: string,
    options?: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>('GET', url, options, schema)
  }

  async post<T>(
    url: string,
    options?: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>('POST', url, options, schema)
  }

  async put<T>(
    url: string,
    options?: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>('PUT', url, options, schema)
  }

  async delete<T>(
    url: string,
    options?: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>('DELETE', url, options, schema)
  }

  private async request<T>(
    method: string,
    url: string,
    options: HTTPRequestOptions = {},
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<HTTPResponse<T>> {
    const fullUrl = this.buildFullUrl(url)

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        const result = await this.executeRequest<T>(method, fullUrl, options, schema)

        // If successful, return the result
        if (!result[0]) {
          return result
        }

        // If error and should retry, continue to next attempt
        if (attempt < this.retryConfig.maxAttempts && this.shouldRetry(result[0], attempt)) {
          await this.delay(this.calculateDelay(attempt))
          continue
        }

        // Return the error if no more retries
        return result
      } catch (error) {
        const networkError = NetworkError.fromFetchError(error as Error)

        // If network error and should retry, continue
        if (attempt < this.retryConfig.maxAttempts && this.shouldRetry(networkError, attempt)) {
          await this.delay(this.calculateDelay(attempt))
          continue
        }

        // Return network error if no more retries
        return [networkError, undefined]
      }
    }

    // This should never be reached, but provides a fallback
    return [new Error('Maximum retry attempts exceeded'), undefined]
  }

  private async executeRequest<T>(
    method: string,
    url: string,
    options: HTTPRequestOptions,
    schema?: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<HTTPResponse<T>> {
    // Apply request interceptors
    const processedOptions = await this.applyRequestInterceptors(url, options)

    // Prepare fetch options
    const fetchOptions = this.prepareFetchOptions(method, processedOptions)

    // Execute the request
    const response = await fetch(url, fetchOptions)
    const responseClone = response.clone()

    let responseData: unknown
    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }

    // Apply response interceptors
    await this.applyResponseInterceptors(response, responseData)

    // Handle successful responses
    if (response.ok) {
      // Validate with schema if provided
      if (schema && responseData !== null) {
        try {
          schema.parse(responseData)
        } catch (error) {
          if (error instanceof ZodError) {
            return [ValidationError.fromZodError(error), undefined]
          }
          return [ValidationError.create('Response validation failed', error as Error), undefined]
        }
      }

      return [undefined, responseData as T]
    }

    // Handle error responses
    const domainError = ErrorInterceptor.createErrorFromResponse(responseClone, responseData)
    return [domainError, undefined]
  }

  private async applyRequestInterceptors(url: string, options: HTTPRequestOptions): Promise<HTTPRequestOptions> {
    let processedOptions = {...options}

    // Apply auth interceptor
    const authInterceptor = this.authInterceptor.getRequestInterceptor()
    processedOptions = await authInterceptor(url, processedOptions)

    return processedOptions
  }

  private async applyResponseInterceptors(response: Response, data: unknown): Promise<void> {
    // Apply auth interceptor
    const authInterceptor = this.authInterceptor.getResponseInterceptor()
    await authInterceptor(response, data)

    // Apply error interceptor
    const errorInterceptor = this.errorInterceptor.getResponseInterceptor()
    await errorInterceptor(response, data)
  }

  private prepareFetchOptions(method: string, options: HTTPRequestOptions): RequestInit {
    const {body, headers = {}, timeout} = options

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    // Handle body
    if (body) {
      if (body instanceof FormData) {
        fetchOptions.body = body
        // Remove Content-Type header for FormData (browser will set it)
        delete (fetchOptions.headers as Record<string, string>)['Content-Type']
      } else {
        fetchOptions.body = JSON.stringify(body)
      }
    }

    // Handle timeout using AbortController
    if (timeout ?? this.config.timeout) {
      const controller = new AbortController()
      const timeoutMs = timeout ?? this.config.timeout

      setTimeout((): void => {
        controller.abort()
      }, timeoutMs)
      fetchOptions.signal = controller.signal
    }

    return fetchOptions
  }

  private buildFullUrl(url: string): string {
    // If url is already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // Build full URL with base URL
    const baseUrl = this.config.baseURL.endsWith('/') ? this.config.baseURL.slice(0, -1) : this.config.baseURL
    const path = url.startsWith('/') ? url : `/${url}`

    return `${baseUrl}${path}`
  }

  private shouldRetry(error: Error, attempt: number): boolean {
    return this.retryConfig.retryCondition?.(error, attempt) ?? false
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.retryConfig.baseDelay * Math.pow(2, attempt - 1)
    const jitteredDelay = exponentialDelay * (0.5 + Math.random() * 0.5) // Add jitter
    return Math.min(jitteredDelay, this.retryConfig.maxDelay)
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve): void => {
      setTimeout(resolve, ms)
    })
  }
}
