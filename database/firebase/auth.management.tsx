'use client'

import {
  createUserWithEmailAndPassword,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { useEffect } from 'react'
import type { IUser } from 'types'
import { authInstance } from './auth'
import { useAuthStore } from './auth.store'

export function useFirebaseAuth() {
  const { setCurrentUser, setLoading } = useAuthStore()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (user: IUser) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [setCurrentUser, setLoading])

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(authInstance, email, password)
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(authInstance, email, password)
  }

  const logout = () => {
    return signOut(authInstance)
  }

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(authInstance, email)
  }

  const updateUserEmail = (email: string) => {
    const user = useAuthStore.getState().currentUser
    if (!user) return Promise.reject(new Error('No current user'))
    return fbUpdateEmail(user, email)
  }

  const updateUserPassword = (password: string) => {
    const user = useAuthStore.getState().currentUser
    if (!user) return Promise.reject(new Error('No current user'))
    return fbUpdatePassword(user, password)
  }

  return {
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
  }
}
