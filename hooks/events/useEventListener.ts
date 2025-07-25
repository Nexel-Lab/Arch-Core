'use client'

import { useEffect, useRef } from 'react'
import { useIsomorphicLayoutEffect } from '../layouts'

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
): void
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<T>,
): void

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement | null,
>(
  eventName: KW | KH,
  handler: (
    event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event,
  ) => void,
  element?: React.RefObject<T>,
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler)

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window
    if (!targetElement?.addEventListener) {
      return
    }

    // Create event listener that calls handler function stored in ref
    const eventListener: typeof handler = (event) => savedHandler.current(event)

    targetElement.addEventListener(eventName, eventListener)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}

export { useEventListener }
