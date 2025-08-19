import type { IErrorComponentProps } from './_h'
import { ErrorComponent } from './ErrorComponent'

export const ErrorPage = (props: IErrorComponentProps) => {
  return (
    <div className='h-dvh w-dvw'>
      <ErrorComponent {...props} />
    </div>
  )
}
