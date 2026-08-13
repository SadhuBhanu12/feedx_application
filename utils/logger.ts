/**
 * Enterprise Logger for FeedX
 * 
 * Provides a standardized way to log across the application.
 * In a production environment, these should connect to Crashlytics, Sentry, or DataDog.
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';

  debug(message: string, context?: any) {
    if (!this.isProduction) {
      console.debug(`[${LogLevel.DEBUG}] ${message}`, context || '');
    }
  }

  info(message: string, context?: any) {
    console.info(`[${LogLevel.INFO}] ${message}`, context || '');
  }

  warn(message: string, context?: any) {
    console.warn(`[${LogLevel.WARN}] ${message}`, context || '');
  }

  error(message: string, error?: any, context?: any) {
    console.error(`[${LogLevel.ERROR}] ${message}`, error || '', context || '');
    // TODO: Send to remote monitoring (e.g., Sentry.captureException(error))
  }
}

export const logger = new Logger();
