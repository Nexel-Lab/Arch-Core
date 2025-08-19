'use client'

import { useCallback, useState } from 'react'

export type TMapOrEntries<K, V> = Map<K, V> | [K, V][]

// Public interface
export interface IActions<K, V> {
  set: (key: K, value: V) => void
  setAll: (entries: TMapOrEntries<K, V>) => void
  remove: (key: K) => void
  reset: Map<K, V>['clear']
}

// We hide some setters from the returned map to disable autocompletion
type TReturn<K, V> = [
  Omit<Map<K, V>, 'set' | 'clear' | 'delete'>,
  IActions<K, V>,
]

function useMap<K, V>(
  initialState: TMapOrEntries<K, V> = new Map(),
): TReturn<K, V> {
  const [map, setMap] = useState(new Map(initialState))

  const actions: IActions<K, V> = {
    set: useCallback((key, value) => {
      setMap((prev) => {
        const copy = new Map(prev)
        copy.set(key, value)
        return copy
      })
    }, []),

    setAll: useCallback((entries) => {
      setMap(() => new Map(entries))
    }, []),

    remove: useCallback((key) => {
      setMap((prev) => {
        const copy = new Map(prev)
        copy.delete(key)
        return copy
      })
    }, []),

    reset: useCallback(() => {
      setMap(() => new Map())
    }, []),
  }

  return [map, actions]
}

export { useMap }
