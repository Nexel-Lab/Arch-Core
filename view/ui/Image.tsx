import NextImage from 'next/image'
import type { CSSProperties, HTMLAttributes } from 'react'

type TObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
type TObjectPosition = string | `${number}% ${number}%`

interface IImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string
  alt: string // Making alt required for accessibility
  className?: string
  objectFit?: TObjectFit
  objectPosition?: TObjectPosition
  quality?: number
  priority?: boolean
  unoptimized?: boolean
  width?: number
  height?: number
  fill?: boolean
  blurDataURL?: string
  loading?: 'lazy' | 'eager'
}

const DEFAULT_BLUR_DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
const DEFAULT_QUALITY = 90

export const Image = ({
  unoptimized,
  src,
  alt,
  className,
  objectFit = 'cover',
  objectPosition = '50% 50%',
  quality = DEFAULT_QUALITY,
  ...props
}: IImageProps) => {
  const imageStyle = {
    objectFit,
    objectPosition,
  }

  if (unoptimized) {
    const { width, height, fill: _, blurDataURL: _1, ...imageProps } = props
    const style =
      width && height
        ? imageStyle
        : {
            ...imageStyle,
            position: 'absolute',
            width: '100%',
            height: '100%',
          }

    return (
      // biome-ignore lint/performance/noImgElement: <image component>
      <img
        alt={alt}
        className={className}
        height={height}
        src={src}
        style={style as CSSProperties}
        width={width}
        {...imageProps}
      />
    )
  }

  const { width, height, fill, blurDataURL, ...imageProps } = props
  const nextProps = fill ? { fill: true } : { width, height }

  return (
    <NextImage
      alt={alt}
      blurDataURL={blurDataURL ?? DEFAULT_BLUR_DATA_URL}
      className={className}
      placeholder='blur'
      quality={quality}
      src={src}
      style={imageStyle}
      {...imageProps}
      {...nextProps}
    />
  )
}
