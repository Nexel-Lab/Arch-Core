'use client'

import { useEventListener } from './useEventListener'

type THandler = (event: MouseEvent) => void

function useClickAnyWhere(handler: THandler) {
  useEventListener('click', (event) => {
    handler(event)
  })
}

export { useClickAnyWhere }
