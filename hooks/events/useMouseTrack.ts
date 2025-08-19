'use client'

import { useEffect, useState } from 'react'

type TMousePosition = {
  x: number | null
  y: number | null
  movementX: number | null
  movementY: number | null
  scrollY: number | null
}

function useMouseTrack() {
  const [mousePosition, setMousePosition] = useState<TMousePosition>({
    x: null,
    y: null,
    movementX: null,
    movementY: null,
    scrollY: null,
  })

  useEffect(() => {
    function handle(e: MouseEvent) {
      setMousePosition({
        x: e.pageX,
        y: e.pageY,
        movementX: e.movementX,
        movementY: e.movementY,
        scrollY: window.scrollY,
      })
    }

    document.addEventListener('mousemove', handle)

    return () => document.removeEventListener('mousemove', handle)
  })
  return mousePosition
}

export { useMouseTrack }
