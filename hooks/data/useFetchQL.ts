/**
 * GraphQL response interface
 */
interface GraphQLResponse<T = any> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
    extensions?: any
  }>
}

/**
 * Options for the fetch request
 */
interface FetchQLOptions {
  headers?: Record<string, string>
  revalidate?: number
  next?: RequestInit
  signal?: AbortSignal
  cache?: RequestCache
  retries?: number
  retryDelay?: number
}

/**
 * GraphQL query interface
 */
interface GraphQLQuery {
  query: string
  variables?: Record<string, any>
  operationName?: string
}

/**
 * Enhanced function to fetch data from a GraphQL endpoint
 *
 * @param endpointURL - The GraphQL API endpoint URL
 * @param ql - The GraphQL query and variables
 * @param options - Additional fetch options
 * @param callback - Optional callback function to execute after fetch
 * @returns The data from the GraphQL response
 */
const useFetchQL = async <T = any>(
  endpointURL: string | URL | undefined | null,
  ql: GraphQLQuery,
  options?: FetchQLOptions,
  callback?: () => void,
): Promise<T> => {
  if (!endpointURL) {
    throw new Error('No GraphQL API endpoint provided for this request')
  }

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    body: JSON.stringify(ql),
    cache: options?.cache,
    signal: options?.signal,
    next: {
      revalidate: options?.revalidate ?? 0,
      ...(options?.next || {}),
    },
  }

  const maxRetries = options?.retries || 0
  const retryDelay = options?.retryDelay || 300

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(endpointURL, fetchOptions)

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
      }

      const res: GraphQLResponse<T> = await response.json()

      if (callback) {
        callback()
      }

      if (res.errors && res.errors.length > 0) {
        const errorMessage = res.errors.map((e) => e.message).join('; ')
        throw new Error(`GraphQL Error: ${errorMessage}`)
      }

      if (!res.data) {
        throw new Error('No data returned from GraphQL endpoint')
      }

      return res.data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxRetries) {
        break
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
  }

  throw lastError || new Error('Failed to fetch from GraphQL endpoint')
}

export {
  useFetchQL,
  type GraphQLResponse,
  type FetchQLOptions,
  type GraphQLQuery,
}
