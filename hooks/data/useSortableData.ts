'use client'

import { useMemo, useState } from 'react'

type TSortConfig<T> = {
  key: keyof T
  direction: 'ascending' | 'descending'
}

function useSortableData<T>(items: T[], config: TSortConfig<T> | null = null) {
  const [sortConfig, setSortConfig] = useState<TSortConfig<T> | null>(config)

  const sortedItems = useMemo(() => {
    const sortableItems: T[] = [...items]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [items, sortConfig])

  function requestSort(key: keyof T) {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return { items: sortedItems, requestSort, sortConfig }
}

export { useSortableData }
