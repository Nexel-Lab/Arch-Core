'use client'

import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

function useOnScreen(ref: RefObject<HTMLElement>, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
      },
      {
        rootMargin,
      },
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      observer.unobserve(ref.current)
    }
  }, [ref, rootMargin])
  return isIntersecting
}

export { useOnScreen }
