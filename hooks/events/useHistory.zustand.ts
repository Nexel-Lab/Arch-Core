'use client'

import { create } from 'zustand'

interface HistoryState<T> {
  past: T[]
  present: T | null
  future: T[]
  canUndo: boolean
  canRedo: boolean
  set: (newPresent: T) => void
  undo: () => void
  redo: () => void
  clear: (initialPresent?: T) => void
}

const createHistoryStore = <T>(initialPresent: T) => {
  return create<HistoryState<T>>((set, get) => ({
    past: [],
    present: initialPresent,
    future: [],
    canUndo: false,
    canRedo: false,

    set: (newPresent: T) => {
      const { present } = get()
      if (newPresent === present) return

      set((state) => ({
        past: [...state.past, state.present as T],
        present: newPresent,
        future: [],
        canUndo: true,
        canRedo: false,
      }))
    },

    undo: () => {
      const { past, present } = get()
      if (past.length === 0) return

      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)

      set((state) => ({
        past: newPast,
        present: previous,
        future: [present as T, ...state.future],
        canUndo: newPast.length > 0,
        canRedo: true,
      }))
    },

    redo: () => {
      const { present, future } = get()
      if (future.length === 0) return

      const next = future[0]
      const newFuture = future.slice(1)

      set((state) => ({
        past: [...state.past, present as T],
        present: next,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      }))
    },

    clear: (initialPresent?: T) => {
      set({
        past: [],
        present: initialPresent ?? get().present,
        future: [],
        canUndo: false,
        canRedo: false,
      })
    },
  }))
}

export const useHistory = <T>(initialPresent: T) => {
  // Create a store instance for this component
  const store = createHistoryStore(initialPresent)

  // Return the store's state and methods
  return store()
}
