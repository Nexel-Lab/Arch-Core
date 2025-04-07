'use client'

import { useEffect } from 'react'
import { useIsFirstRender } from './useIsFirstRender'

function useUpdateEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList = [],
) {
  const isFirst = useIsFirstRender()

  useEffect(() => {
    if (!isFirst) {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst, effect, ...deps])
}

export { useUpdateEffect }
