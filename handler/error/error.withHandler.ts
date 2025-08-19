import { AppError, errorHandler } from './error.handler'

interface IHandlerOptions<T> {
  defaultErrorMessage?: string
  context?: Record<string, unknown>
  onError?: (error: AppError) => Promise<T> | T
  silent?: boolean
}

export function withErrorHandler<P extends unknown[], T>(
  handler: AsyncHandler<P, T>,
  options: IHandlerOptions<T> = {},
): AsyncHandler<P, T> {
  return async (...args: P): Promise<T> => {
    try {
      return await handler(...args)
    } catch (error) {
      const handledError = errorHandler(error, {
        defaultMessage: options.defaultErrorMessage,
        context: {
          ...options.context,
          arguments: args,
          handlerName: handler.name,
        },
        silent: options.silent,
      })

      if (options.onError) {
        return options.onError(handledError)
      }

      throw handledError
    }
  }
}

interface IApiResponse<T> {
  data?: T
  error?: string
  warn?: string
}

export function withApiErrorHandler<P extends unknown[], T>(
  handler: AsyncHandler<P, T>,
  options: Omit<IHandlerOptions<IApiResponse<T>>, 'onError'> = {},
): AsyncHandler<P, IApiResponse<T>> {
  return async (...args: P): Promise<IApiResponse<T>> => {
    try {
      const result = await handler(...args)
      return { data: result }
    } catch (error) {
      const handledError = errorHandler(error, {
        defaultMessage: options.defaultErrorMessage,
        context: {
          ...options.context,
          arguments: args,
          handlerName: handler.name,
        },
        silent: options.silent,
      })

      return {
        error:
          handledError instanceof AppError
            ? handledError.message
            : 'An unexpected error occurred',
      }
    }
  }
}
