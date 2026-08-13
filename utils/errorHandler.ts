import { logger } from './logger';
import { Alert } from 'react-native';

/**
 * Standardized Error Response interface for FeedX
 */
export interface AppError {
  message: string;
  code?: string;
  isNetworkError?: boolean;
}

/**
 * Handles errors gracefully across the application.
 */
export class ErrorHandler {
  /**
   * Parses various error types (Network, Supabase, standard Errors) into a unified format.
   */
  static parseError(error: any): AppError {
    let message = 'An unexpected error occurred. Please try again.';
    let code = 'UNKNOWN_ERROR';
    let isNetworkError = false;

    if (error?.message) {
      message = error.message;
    }
    if (error?.code) {
      code = error.code;
    }

    // Check for common network error signatures
    if (
      message.toLowerCase().includes('network') ||
      message.toLowerCase().includes('fetch') ||
      error?.name === 'TypeError'
    ) {
      isNetworkError = true;
      message = 'Please check your internet connection and try again.';
    }

    return { message, code, isNetworkError };
  }

  /**
   * Logs the error and optionally displays an alert to the user.
   */
  static handleError(error: any, context: string, showUI: boolean = false) {
    const parsedError = this.parseError(error);
    
    logger.error(`Error in ${context}: ${parsedError.message}`, error, { code: parsedError.code });

    if (showUI) {
      Alert.alert(
        parsedError.isNetworkError ? 'Network Error' : 'Error',
        parsedError.message
      );
    }
    
    return parsedError;
  }
}
