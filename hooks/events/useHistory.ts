'use client'

import { useCallback, useReducer } from 'react'

export type THistoryState<T> = {
  past: T[]
  present: T | null
  future: T[]
}

type HistoryAction<T> =
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET'; newPresent: T }
  | { type: 'CLEAR'; initialPresent: T }

// const initialState = {
//   past: [],
//   present: null,
//   future: [],
// }

function reducer<T>(
  state: THistoryState<T>,
  action: HistoryAction<T>,
): THistoryState<T> {
  const { past, present, future } = state
  switch (action.type) {
    case 'UNDO': {
      if (past.length === 0) return state
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [present as T, ...future],
      }
    }
    case 'REDO': {
      if (future.length === 0) return state
      const next = future[0]
      const newFuture = future.slice(1)
      return {
        past: [...past, present as T],
        present: next,
        future: newFuture,
      }
    }
    case 'SET': {
      const { newPresent } = action
      if (newPresent === present) {
        return state
      }
      return {
        past: present !== null ? [...past, present] : past,
        present: newPresent,
        future: [],
      }
    }
    case 'CLEAR': {
      const { initialPresent } = action
      return {
        past: [],
        present: initialPresent,
        future: [],
      }
    }
    default:
      return state
  }
}

function useHistory<T>(initialPresent: T) {
  const [state, dispatch] = useReducer(reducer<T>, {
    past: [],
    present: initialPresent,
    future: [],
  })

  const canUndo = state.past.length !== 0
  const canRedo = state.future.length !== 0

  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: 'UNDO' })
    }
  }, [canUndo])

  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: 'REDO' })
    }
  }, [canRedo])

  const set = useCallback(
    (newPresent: T) => dispatch({ type: 'SET', newPresent }),
    [],
  )

  const clear = useCallback(
    () => dispatch({ type: 'CLEAR', initialPresent }),
    [initialPresent],
  )

  return { state: state.present, set, undo, redo, clear, canUndo, canRedo }
}

export { useHistory }
