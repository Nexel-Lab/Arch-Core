'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from '../utils/useDebounce'

interface DomRectSSR {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}

type ElRef = React.RefObject<HTMLDivElement>

interface Size {
  clientRect: DomRectSSR
  offsetTop: number
  isReady: boolean
}

const EmptySSRRect: DomRectSSR = {
  bottom: 1,
  height: 1,
  left: 1,
  right: 1,
  top: 1,
  width: 1,
  x: 1,
  y: 1,
}

const emptySize: Size = {
  clientRect: EmptySSRRect,
  offsetTop: 0,
  isReady: false,
}

const useElementSizeWithDebounce = (elRef: ElRef) => {
  const [size, setSize] = useState<Size>(emptySize)

  const onResize = useCallback(() => {
    if (!elRef.current) {
      return () => {
        // no cleanup needed
      }
    }
    const rect = elRef.current.getBoundingClientRect()

    return setSize({
      clientRect: rect,
      isReady: true,
      offsetTop: elRef.current.offsetTop,
    })
  }, [elRef])

  useEffect(() => {
    // biome-ignore lint/correctness/useHookAtTopLevel: <no explanation>
    const onResizeDebounced = useDebounce(onResize, 300)

    window.addEventListener('resize', onResizeDebounced)
    onResize()

    return () => {
      window.removeEventListener('resize', onResizeDebounced)
    }
  }, [onResize])

  return {
    onResize,
    size,
  }
}

export { useElementSizeWithDebounce }
