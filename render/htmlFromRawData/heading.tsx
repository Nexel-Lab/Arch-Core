import { memo } from 'react'
import { HEADING_STYLES, type TTextContent } from './_header'
import { Text } from './text'

const Heading = memo(
  ({
    type,
    children,
  }: {
    type: keyof typeof HEADING_STYLES
    children: TTextContent[]
  }) => {
    const Tag = type.replace('heading-', 'h') as keyof JSX.IntrinsicElements
    return (
      <Tag className={HEADING_STYLES[type]}>
        <Text block={children} />
      </Tag>
    )
  },
)

Heading.displayName = 'Heading'

export { Heading }
