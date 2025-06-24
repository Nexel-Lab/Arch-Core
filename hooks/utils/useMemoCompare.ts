'use client'

import { useEffect, useRef } from 'react'

function useMemoCompare<T>(
  next: T,
  compare: (prev: T | undefined, next: T) => boolean,
): T {
  const previousRef = useRef<T | undefined>(undefined)
  const previous = previousRef.current
  const isEqual = compare(previous, next)

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next
    }
  })

  // biome-ignore lint/style/noNonNullAssertion: <no explanation>
  return isEqual ? previous! : next
}

export { useMemoCompare }
