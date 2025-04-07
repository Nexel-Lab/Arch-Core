'use client'

import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const DEFAULT_COOKIE_NAME = 'accept_cookies'

const useAcceptCookies = (name?: string) => {
  const COOKIE_NAME = name || DEFAULT_COOKIE_NAME
  const [acceptedCookies, setAcceptedCookies] = useState(true)

  useEffect(() => {
    if (!Cookies.get(COOKIE_NAME)) {
      setAcceptedCookies(false)
    }
  }, [COOKIE_NAME])

  const acceptCookies = () => {
    setAcceptedCookies(true)
    Cookies.set(COOKIE_NAME, 'accepted', { expires: 365 })
  }

  return {
    acceptedCookies,
    onAcceptCookies: acceptCookies,
  }
}

export { useAcceptCookies }
