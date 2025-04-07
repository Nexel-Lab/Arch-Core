// stores/useAuthStore.ts
import type { IUser } from 'types'
import { create } from 'zustand'

interface AuthStore {
  currentUser: IUser | undefined
  setCurrentUser: (user: IUser | undefined) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: undefined,
  loading: true,
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (loading) => set({ loading }),
}))
