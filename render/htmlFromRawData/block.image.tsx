import Image from 'next/image'
import { memo } from 'react'
import type { TImageContent } from './_header'

const ImageBlock = memo(({ src, altText, height, width }: TImageContent) => {
  if (!src || !altText) return null

  return (
    <div className='flex w-full justify-center py-8'>
      <Image
        alt={altText}
        blurDataURL='data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
        className='overflow-hidden rounded-lg'
        height={height}
        objectFit='cover'
        placeholder='blur'
        src={src}
        width={width}
      />
    </div>
  )
})

ImageBlock.displayName = 'ImageBlock'

export { ImageBlock }
