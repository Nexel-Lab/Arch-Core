import { Content, ImageContent, TextContent, RawContent } from 'types'
import React from 'react'
import Image from 'next/image'
import { cn } from '@/libs/styles'

const renderContent = (content: Content | TextContent | ImageContent) => {
  if ('text' in content) {
    // Handle TextContent
    return content.bold ? (
      <strong className='text-quaternary-2 dark:text-primary-0 px-0.5 font-semibold'>
        {content.text}
      </strong>
    ) : (
      content.text
    )
  } else if ('src' in content) {
    // Handle ImageContent
    return (
      <div className='flex w-full justify-center py-8'>
        <Image
          className='overflow-hidden rounded-lg'
          src={content.src}
          alt={content.altText}
          height={content.height}
          width={content.width}
          // fill
          objectFit='cover'
          placeholder='blur'
          blurDataURL={
            'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
          }
        />
      </div>
    )
  } else if ('type' in content) {
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
          <h1 className='pt-16 pb-4 text-3xl font-semibold lg:pt-24 lg:text-5xl'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h1>
        )
      case 'heading-two':
        return (
          <h2 className='pt-16 pb-4 text-2xl font-semibold lg:pt-24 lg:text-4xl'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h2>
        )
      case 'heading-three':
        return (
          <h3 className='text-1xl pt-16 pb-4 font-semibold lg:pt-24 lg:text-3xl'>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {renderContent(child)}
              </React.Fragment>
            ))}
          </h3>
        )
      case 'heading-four':
        return (
          <h4 className='py-4 pl-4 text-lg font-semibold lg:py-8 lg:pl-8 lg:text-xl'>
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
          <h6 className='py-8 pl-6 text-xl font-light italic lg:py-16 lg:pl-12 lg:text-3xl lg:leading-10'>
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
          <blockquote className='border-l-quaternary-2 dark:border-l-primary-0 my-6 rounded-md border-4 border-y-white/0 border-r-white/0 bg-black/5 p-6 text-xl font-light lg:my-12 lg:text-2xl lg:leading-10 dark:bg-black/40'>
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
  } else {
    return null
  }
}

interface HTMLFromRawProps {
  data: { content: RawContent }
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
