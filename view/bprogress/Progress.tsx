'use client'

import { AppProgressProvider as BProgress } from '@bprogress/next'
import { useUiStore } from '@/store'

export const Progress = ({
  color,
}: {
  color: { light: string; dark: string }
}) => {
  const isDark = useUiStore((st) => st.isDark)
  return (
    <BProgress
      color={isDark ? color.dark : color.light}
      options={{
        showSpinner: false,
        parent: '#nprogress-nav-parent',
      }}
      shallowRouting
    />
  )
}
