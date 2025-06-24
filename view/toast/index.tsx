'use client'

import type { ToastClassName } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import { cn } from '../../view/styles'

const Toast = () => {
  const contextClass = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-gray-600',
    warning: 'bg-orange-400',
    default: 'bg-black',
    // dark: 'bg-white-600 font-gray-300',
  }

  type TToastType = 'success' | 'error' | 'info' | 'warning' | 'default'
  // | 'dark'

  return (
    <ToastContainer
      closeButton={ToastCloseButton}
      // newestOnTop
      // stacked
      // theme='dark'
      position='top-right'
      toastClassName={
        ((context) => {
          if (context?.type && context?.defaultClassName) {
            return cn(
              contextClass[(context.type || 'default') as TToastType],
              'relative z-0 m-1 flex min-h-16 min-w-80 cursor-pointer touch-none items-center rounded-md border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-md',
            )
          }
          return ''
        }) as ToastClassName
      }
      // progressClassName={(css) => 'h-64'}
    />
  )
}

const ToastCloseButton = ({ closeToast }: { closeToast: () => void }) => (
  <button className='Toastify__close-button Toastify__close-button--dark'>
    <svg aria-hidden='true' onClick={closeToast} viewBox='0 0 14 16'>
      <path
        d='M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z'
        fillRule='evenodd'
      />
    </svg>
  </button>
)

export { Toast }
