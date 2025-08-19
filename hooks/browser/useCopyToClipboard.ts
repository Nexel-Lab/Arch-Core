'use client'

import { useState } from 'react'

type TCopiedValue = string | null
type TCopyFn = (text: string) => Promise<boolean> // Return success

function useCopyToClipboard(): [TCopiedValue, TCopyFn] {
  const [copiedText, setCopiedText] = useState<TCopiedValue>(null)

  const copy: TCopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }

  return [copiedText, copy]
}

export { useCopyToClipboard }
