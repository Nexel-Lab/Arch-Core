'use client'

import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

type TElementPosition = {
  x: number
  y: number
}

function useElementPosition(el: RefObject<HTMLElement>): TElementPosition {
  const [elementPosition, setElementPosition] = useState<TElementPosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    function handlePosition() {
      const element = el.current
      if (!element) return

      const x =
        element.getBoundingClientRect().left +
        document.documentElement.scrollLeft +
        element.offsetWidth / 2
      const y =
        element.getBoundingClientRect().top +
        document.documentElement.scrollTop +
        element.offsetHeight / 2

      setElementPosition({ x, y })
    }

    handlePosition()

    window.addEventListener('resize', handlePosition)
    // window.addEventListener('scroll', handlePosition)

    return () => {
      window.removeEventListener('resize', handlePosition)
      // window.removeEventListener('scroll', handlePosition)
    }
  }, [el])

  return elementPosition
}

export { useElementPosition }
