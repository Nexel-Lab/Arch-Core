import { memo } from 'react'
import type { TTextContent } from './_header'
import { Text } from './text'

const BlockQuote = memo(({ children }: { children: TTextContent[] }) => (
  <blockquote className='my-6 rounded-md border-4 border-y-white/0 border-r-white/0 border-l-quaternary-2 bg-black/5 p-6 font-light text-xl lg:my-12 lg:text-2xl lg:leading-10 dark:border-l-primary-0 dark:bg-black/40'>
    <Text block={children} />
  </blockquote>
))

BlockQuote.displayName = 'BlockQuote'

export { BlockQuote }
