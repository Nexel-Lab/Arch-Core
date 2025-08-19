import Link from 'next/link'
import type { IErrorComponentProps } from './_h'

export const ErrorComponent = ({
  Icon,
  name,
  description,
  fallback,
}: IErrorComponentProps) => {
  return (
    <div className='flex size-full items-center justify-center'>
      <div className='text-center'>
        <div className='mb-4 flex w-full justify-center'>
          <Icon className='size-24 text-foreground' />
        </div>
        <h2 className='font-bold'>Error occurred while {name}</h2>
        {description && <p className='text-xs opacity-70'>{description}</p>}
        {fallback && (
          <div className='flex items-center justify-center gap-2'>
            {fallback.map((button) => (
              <Link href={button.url} key={button.title}>
                <button
                  className='mt-4 rounded-sm border border-primary bg-primary/10 px-2 py-1 text-foreground text-xs'
                  title={button.title}
                >
                  {button.title}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
