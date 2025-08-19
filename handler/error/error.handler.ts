import { apiLogger } from '#core/logger/sentry'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
    public context?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, context)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'AUTHENTICATION_ERROR', 401, context)
    this.name = 'AuthenticationError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'DATABASE_ERROR', 500, context)
    this.name = 'DatabaseError'
  }
}

interface IErrorHandlerOptions {
  defaultMessage?: string
  context?: Record<string, unknown>
  silent?: boolean
}

const errorHandler = (
  error: unknown,
  options: IErrorHandlerOptions = {},
): AppError => {
  const {
    defaultMessage = 'An unexpected error occurred',
    context = {},
    silent = false,
  } = options

  let appError: AppError

  if (error instanceof AppError) {
    appError = error
  } else if (error instanceof Error) {
    appError = new AppError(
      error.message || defaultMessage,
      'UNKNOWN_ERROR',
      500,
      context,
    )
    appError.stack = error.stack
  } else if (typeof error === 'string') {
    appError = new AppError(error, 'UNKNOWN_ERROR', 500, context)
  } else {
    appError = new AppError(defaultMessage, 'UNKNOWN_ERROR', 500, context)
  }

  if (!silent) {
    apiLogger.error(appError.message, appError, {
      code: appError.code,
      statusCode: appError.statusCode,
      ...appError.context,
      ...context,
    })
  }

  return appError
}

export const isErrorType = (
  error: unknown,
  ErrorType: new (...args: unknown[]) => Error,
): boolean => {
  return error instanceof ErrorType
}

export { errorHandler }
