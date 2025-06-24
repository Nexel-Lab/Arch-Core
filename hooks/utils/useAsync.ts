'use client'

import { useCallback, useEffect, useState } from 'react'

const useAsync = <T>(asyncFunction: () => Promise<T>, immediate = true) => {
  type statusState = 'idle' | 'pending' | 'success' | 'error'
  const [status, setStatus] = useState<statusState>('idle')
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState(null)

  const execute = useCallback(() => {
    setStatus('pending')
    setValue(null)
    setError(null)

    return asyncFunction()
      .then((response) => {
        setValue(response)
        setStatus('success')
      })
      .catch((error) => {
        setError(error)
        setStatus('error')
      })
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, value, error }
}

export { useAsync }
