import { CONTENT_BLOCK_TYPE } from './_header'
import type {
  TRawContent,
  TContent,
  TTextContent,
  TImageContent,
} from './_header'
import { memo, useCallback, Fragment } from 'react'
import { cn } from '@/libs/styles'
import { ImageBlock } from './block.image'
import { BlockQuote } from './block.quote'
import { Heading } from './heading'
import { Text } from './text'

const HtmlFromRawData = memo(({ data }: { data: TRawContent }) => {
  const renderContent = useCallback(
    (content: TContent | TTextContent | TImageContent) => {
      if ('text' in content) {
        return content.bold ? (
          <strong className='text-quaternary-2 dark:text-primary-0 px-0.5 font-semibold'>
            {content.text}
          </strong>
        ) : (
          content.text
        )
      }

      if ('src' in content) {
        return <ImageBlock {...(content as TImageContent)} />
      }

      if ('type' in content) {
        const { type, children } = content

        switch (type) {
          case CONTENT_BLOCK_TYPE.Class:
            return (
              <div className={cn(content.className)}>
                {children.map((child, index) => (
                  <Fragment key={`class-${index}`}>
                    {renderContent(child)}
                  </Fragment>
                ))}
              </div>
            )

          case CONTENT_BLOCK_TYPE.BlockQuote:
            return <BlockQuote children={children as TTextContent[]} />

          case CONTENT_BLOCK_TYPE.Paragraph:
            return (
              <p className='py-2 text-[#5c5c5c] dark:text-[#bbbbbb]'>
                &emsp;&emsp;&emsp;
                <Text block={children as TTextContent[]} />
              </p>
            )

          case CONTENT_BLOCK_TYPE.HeadingOne:
          case CONTENT_BLOCK_TYPE.HeadingTwo:
          case CONTENT_BLOCK_TYPE.HeadingThree:
          case CONTENT_BLOCK_TYPE.HeadingFour:
          case CONTENT_BLOCK_TYPE.HeadingFive:
          case CONTENT_BLOCK_TYPE.HeadingSix:
            return <Heading type={type} children={children as TTextContent[]} />

          default:
            return children.map((child, index) => (
              <Fragment key={`default-${index}`}>
                {renderContent(child)}
              </Fragment>
            ))
        }
      }

      return null
    },
    [],
  )

  return (
    <div>
      {data.content.children.map((child, index) => (
        <Fragment key={`content-${index}`}>{renderContent(child)}</Fragment>
      ))}
    </div>
  )
})

HtmlFromRawData.displayName = 'HTMLFromRaw'

export { HtmlFromRawData, Text, ImageBlock, BlockQuote, Heading }
