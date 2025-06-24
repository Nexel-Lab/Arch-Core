'use client'

import { AppProgressProvider as BProgress } from '@bprogress/next'
import { useUiState } from '@/store'

export const Progress = ({
  color,
}: {
  color: { light: string; dark: string }
}) => {
  const _dark = useUiState((st) => st.isDark)
  return (
    <BProgress
      color={_dark ? color.dark : color.light}
      options={{
        showSpinner: false,
        parent: '#nprogress-nav-parent',
      }}
      shallowRouting
    />
  )
}
