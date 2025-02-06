import { TImageContent } from './_header'
import Image from 'next/image'
import { memo } from 'react'

const ImageBlock = memo(({ src, altText, height, width }: TImageContent) => {
  if (!src || !altText) return null

  return (
    <div className='flex w-full justify-center py-8'>
      <Image
        className='overflow-hidden rounded-lg'
        src={src}
        alt={altText}
        height={height}
        width={width}
        objectFit='cover'
        placeholder='blur'
        blurDataURL='data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
      />
    </div>
  )
})

ImageBlock.displayName = 'ImageBlock'

export { ImageBlock }
