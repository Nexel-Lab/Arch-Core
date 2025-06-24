import Image from 'next/image'
import React from 'react'
import { cn } from '../../../view/styles'
import type {
  TContent,
  TImageContent,
  TRawContent,
  TTextContent,
} from './_header'

const renderContent = (content: TContent | TTextContent | TImageContent) => {
  if ('text' in content) {
    // Handle TextContent
    return content.bold ? (
      <strong className='px-0.5 font-semibold text-quaternary-2 dark:text-primary-0'>
        {content.text}
      </strong>
    ) : (
      content.text
    )
  }
  if ('src' in content) {
    // Handle ImageContent
    return (
      <div className='flex w-full justify-center py-8'>
        <Image
          alt={content.altText}
          blurDataURL={
            'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
          }
          className='overflow-hidden rounded-lg'
          height={content.height}
          objectFit='cover'
          // fill
          placeholder='blur'
          src={content.src}
          width={content.width}
        />
      </div>
    )
  }
  if ('type' in content) {
    // Handle Content
    const { type, children } = content
    switch (type) {
      case 'class':
        return (
          <div className={cn(content.className)}>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </div>
        )
      case 'heading-one':
        return (
          <h1 className='pt-16 pb-4 font-semibold text-3xl lg:pt-24 lg:text-5xl'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h1>
        )
      case 'heading-two':
        return (
          <h2 className='pt-16 pb-4 font-semibold text-2xl lg:pt-24 lg:text-4xl'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h2>
        )
      case 'heading-three':
        return (
          <h3 className='pt-16 pb-4 font-semibold text-1xl lg:pt-24 lg:text-3xl'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h3>
        )
      case 'heading-four':
        return (
          <h4 className='py-4 pl-4 font-semibold text-lg lg:py-8 lg:pl-8 lg:text-xl'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h4>
        )
      case 'heading-five':
        return (
          <h5 className='py-8 pl-8 font-semibold lg:text-lg'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h5>
        )
      case 'heading-six':
        return (
          <h6 className='py-8 pl-6 font-light text-xl italic lg:py-16 lg:pl-12 lg:text-3xl lg:leading-10'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h6>
        )
      case 'paragraph':
        return (
          <p>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </p>
        )
      case 'block-quote':
        return (
          <blockquote className='my-6 rounded-md border-4 border-y-white/0 border-r-white/0 border-l-quaternary-2 bg-black/5 p-6 font-light text-xl lg:my-12 lg:text-2xl lg:leading-10 dark:border-l-primary-0 dark:bg-black/40'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </blockquote>
        )
      default:
        return children.map((child, index) => (
          <React.Fragment key={index}>{renderContent(child)}</React.Fragment>
        ))
    }
  }
  return null
}

interface HTMLFromRawProps {
  data: { content: TRawContent }
}

const HTMLFromRaw: React.FC<HTMLFromRawProps> = ({ data }) => {
  return (
    <div>
      {data.content.children.map((child, index) => (
        <React.Fragment key={index}>{renderContent(child)}</React.Fragment>
      ))}
    </div>
  )
}

export { HTMLFromRaw }
