'use client'

import { useEffect, useRef } from 'react'

/**
 * Custom hook that provides AbortController functionality for managing cancelable fetch requests.
 * Automatically cancels previous requests when a new signal is requested and cleans up on component unmount.
 *
 * @returns A function that returns a new AbortSignal, canceling any previous requests
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [data, setData] = useState(null)
 *   const getSignal = useAbortController()
 *
 *   useEffect(() => {
 *     const signal = getSignal()
 *     fetchData(signal)
 *       .then(setData)
 *       .catch((err) => {
 *         if (err.name !== 'AbortError') console.error(err)
 *       })
 *   }, [getSignal])
 *
 *   return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>
 * }
 * ```
 */
const useAbortController = () => {
  /** Ref to keep track of the current AbortController instance */
  const controllerRef = useRef<AbortController | null>(null)

  /**
   * Creates a new AbortController and returns its signal,
   * aborting any previously created controller
   *
   * @returns A new AbortSignal instance
   */
  const getSignal = () => {
    if (controllerRef.current) {
      controllerRef.current.abort() // Cancel previous request
    }
    controllerRef.current = new AbortController()
    return controllerRef.current.signal
  }

  /* Cleanup effect to abort any pending requests when component unmounts */
  useEffect(() => {
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  return getSignal
}

/**
 * Helper function to fetch data with abort signal handling
 *
 * @param url - The URL to fetch from
 * @param options - Additional fetch options
 * @param signal - AbortSignal for cancellation
 * @returns Promise with the fetched data
 */
export const fetchWithAbort = async <T>(
  url: string,
  options: RequestInit,
  signal: AbortSignal,
): Promise<T> => {
  const response = await fetch(url, { ...options, signal })
  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`,
    )
  }
  return response.json() as Promise<T>
}

export { useAbortController }
