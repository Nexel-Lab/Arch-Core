import type { TTextContent } from './_header'
import { memo, Fragment } from 'react'

const Text = memo(({ block }: { block: TTextContent[] }) => {
  return (
    <>
      {block.map(({ text, bold }, i) => (
        <Fragment key={`text-${i}`}>
          {bold ? (
            <strong className='px-0.5 font-semibold text-primary'>
              {text}
            </strong>
          ) : (
            text
          )}
        </Fragment>
      ))}
    </>
  )
})

Text.displayName = 'Text'

export { Text }
