'use client'

import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const DEFAULT_COOKIE_NAME = 'cookieConsent'

type TCookieConsentPayload = {
  accepted: boolean
  timestamp: string
  necessary: boolean
  preference: boolean
  region: string
}

const useCookieConsent = (name?: string) => {
  const COOKIE_NAME = name || DEFAULT_COOKIE_NAME
  const [acceptedCookies, setAcceptedCookies] = useState(true)

  useEffect(() => {
    const cookie = Cookies.get(COOKIE_NAME)
    if (!cookie) {
      setAcceptedCookies(false)
    }
  }, [COOKIE_NAME])

  const acceptCookies = ({
    necessary = true,
    preference = true,
    region = 'unknown',
  }: Partial<Omit<TCookieConsentPayload, 'accepted' | 'timestamp'>> = {}) => {
    const payload: TCookieConsentPayload = {
      accepted: true,
      timestamp: new Date().toISOString(),
      necessary,
      preference,
      region,
    }

    Cookies.set(COOKIE_NAME, JSON.stringify(payload), {
      expires: 365,
      sameSite: 'Lax',
    })

    setAcceptedCookies(true)
  }

  return {
    acceptedCookies,
    onAcceptCookies: acceptCookies,
  }
}

export { useCookieConsent }
