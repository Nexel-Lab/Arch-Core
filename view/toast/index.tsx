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
      position='bottom-right'
      toastClassName={
        ((c) => {
          if (c?.type) {
            return cn(
              contextClass[(c.type || 'default') as TToastType],
              'relative z-90 mx-3 my-3 flex min-h-10 cursor-pointer justify-between overflow-hidden rounded-md border border-white/10 bg-opacity-30 p-3 backdrop-blur-md backdrop-filter',
            )
          }
          return ''
        }) as ToastClassName
      }
      // bodyClassName={() => 'text-sm font-white font-med block p-3 flex'}
      closeButton={ToastCloseButton}
      // progressClassName={(css) => 'h-64'}
    />
  )
}

const ToastCloseButton = ({ closeToast }: { closeToast: () => void }) => (
  <div className='m-1 h-3 w-3 fill-white'>
    <svg onClick={closeToast} aria-hidden='true' viewBox='0 0 14 16'>
      <path
        fillRule='evenodd'
        d='M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z'
      />
    </svg>
  </div>
)

export { Toast }
