/**
 * Logger interface for the Cervantes client
 *
 * Provides a consistent logging interface that can be configured by the application.
 * This allows applications to integrate the client with their own logging systems
 * (e.g., Winston, Pino, custom loggers) or disable logging entirely.
 */

export interface Logger {
  /**
   * Log debug-level messages (typically for development/troubleshooting)
   */
  debug(message: string, context?: unknown): void

  /**
   * Log informational messages
   */
  info(message: string, context?: unknown): void

  /**
   * Log warning messages
   */
  warn(message: string, context?: unknown): void

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown): void
}

/**
 * Console-based logger implementation
 *
 * Uses the browser/Node.js console for logging. Suitable for development
 * and debugging purposes.
 */
export class ConsoleLogger implements Logger {
  debug(message: string, context?: unknown): void {
    if (context !== undefined) {
      // eslint-disable-next-line no-console
      console.debug(message, context)
    } else {
      // eslint-disable-next-line no-console
      console.debug(message)
    }
  }

  info(message: string, context?: unknown): void {
    if (context !== undefined) {
      // eslint-disable-next-line no-console
      console.info(message, context)
    } else {
      // eslint-disable-next-line no-console
      console.info(message)
    }
  }

  warn(message: string, context?: unknown): void {
    if (context !== undefined) {
      // eslint-disable-next-line no-console
      console.warn(message, context)
    } else {
      // eslint-disable-next-line no-console
      console.warn(message)
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (error !== undefined) {
      // eslint-disable-next-line no-console
      console.error(message, error)
    } else {
      // eslint-disable-next-line no-console
      console.error(message)
    }
  }
}

/**
 * No-operation logger implementation
 *
 * Discards all log messages. Suitable for production environments where
 * you want to disable client logging entirely.
 */
export class NoOpLogger implements Logger {
  debug(): void {
    // No-op
  }

  info(): void {
    // No-op
  }

  warn(): void {
    // No-op
  }

  error(): void {
    // No-op
  }
}

/**
 * Create a default logger based on environment
 *
 * Returns a NoOpLogger by default (safe for production).
 * Applications should explicitly provide a logger if they want logging enabled.
 */
export function createDefaultLogger(): Logger {
  return new NoOpLogger()
}
