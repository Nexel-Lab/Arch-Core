'use client'

import { useEffect, useState } from 'react'

interface IArgs extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: IArgs,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: updateEntry changes on every re-render and should not be used as a hook dependency
  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elementRef,
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
    threshold,
  ])

  return entry
}

export { useIntersectionObserver }
