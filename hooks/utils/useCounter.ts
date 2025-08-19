'use client'

import { useState } from 'react'

interface IReturnType {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: React.Dispatch<React.SetStateAction<number>>
}

function useCounter(initialValue?: number): IReturnType {
  const [count, setCount] = useState(initialValue || 0)

  const increment = () => setCount((x) => x + 1)
  const decrement = () => setCount((x) => x - 1)
  const reset = () => setCount(initialValue || 0)

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  }
}

export { useCounter }
