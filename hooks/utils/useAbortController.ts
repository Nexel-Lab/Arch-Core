import { useEffect, useRef } from 'react'

const useAbortController = () => {
  const controllerRef = useRef<AbortController | null>(null)

  // Create a new AbortController on each call
  const getSignal = () => {
    if (controllerRef.current) {
      controllerRef.current.abort() // Cancel previous request
    }
    controllerRef.current = new AbortController()
    return controllerRef.current.signal
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  return getSignal
}

// How to use:
// import { useState, useEffect } from 'react'
// import { useAbortController } from './useAbortController'

// const fetchData = async (signal: AbortSignal) => {
//   const res = await fetch('/api/data', { signal })
//   if (!res.ok) throw new Error('Failed to fetch')
//   return res.json()
// }

// const MyComponent = () => {
//   const [data, setData] = useState(null)
//   const getSignal = useAbortController()

//   useEffect(() => {
//     const signal = getSignal() // Get a new signal for this request
//     fetchData(signal)
//       .then(setData)
//       .catch((err) => {
//         if (err.name !== 'AbortError') console.error(err)
//       })

//     // Cleanup is handled by the hook
//   }, [])

//   return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>
// }

export { useAbortController }
