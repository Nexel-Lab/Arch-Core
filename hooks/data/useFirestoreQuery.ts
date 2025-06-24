'use client'

import type {
  DocumentData,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
} from 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore'
import { useEffect, useReducer } from 'react'
import { useMemoCompare } from '../utils/useMemoCompare'

// --- Types ---
type FirestoreStatus = 'idle' | 'loading' | 'success' | 'error'

interface FirestoreState<T> {
  status: FirestoreStatus
  data?: T | T[] | null
  error?: Error
}

type FirestoreAction<T> =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; payload: T | T[] | null }
  | { type: 'error'; payload: Error }

// --- Reducer ---
function reducer<T>(
  _state: FirestoreState<T>,
  action: FirestoreAction<T>,
): FirestoreState<T> {
  switch (action.type) {
    case 'idle':
      return { status: 'idle', data: undefined, error: undefined }
    case 'loading':
      return { status: 'loading', data: undefined, error: undefined }
    case 'success':
      return { status: 'success', data: action.payload, error: undefined }
    case 'error':
      return { status: 'error', data: undefined, error: action.payload }
    default:
      throw new Error('Invalid action type')
  }
}

// --- Hook ---
function useFirestoreQuery<T = DocumentData>(
  query: Query<DocumentData> | DocumentSnapshot<DocumentData> | null,
) {
  const initialState: FirestoreState<T | T[]> = {
    status: query ? 'loading' : 'idle',
    data: undefined,
    error: undefined,
  }

  const [state, dispatch] = useReducer(reducer<T | T[]>, initialState)

  const queryCached = useMemoCompare(
    query,
    (prevQuery) =>
      prevQuery && query && 'isEqual' in query && query.isEqual(prevQuery),
  )

  useEffect(() => {
    if (!queryCached) {
      dispatch({ type: 'idle' })
      return
    }

    dispatch({ type: 'loading' })

    const unsubscribe = onSnapshot(
      queryCached as any,
      (
        snapshot: QuerySnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
      ) => {
        const data =
          'docs' in snapshot
            ? getCollectionData<T>(snapshot)
            : getDocData<T>(snapshot)

        dispatch({ type: 'success', payload: data })
      },
      (error: Error) => {
        dispatch({ type: 'error', payload: error })
      },
    )

    return unsubscribe
  }, [queryCached])

  return state
}

// --- Helpers ---
function getDocData<T>(doc: DocumentSnapshot<DocumentData>): T | null {
  return doc.exists() ? ({ id: doc.id, ...doc.data() } as T) : null
}

function getCollectionData<T>(collection: QuerySnapshot<DocumentData>): T[] {
  return collection.docs.map(getDocData).filter(Boolean) as T[]
}

export { useFirestoreQuery }
