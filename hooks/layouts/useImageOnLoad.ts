'use client'

import { useState } from 'react'

interface IImageStyle {
  thumbnail: React.CSSProperties
  fullSize: React.CSSProperties
}

interface IImageOnLoadType {
  handleImageOnLoad: () => void
  css: IImageStyle
}

function useImageOnLoad(): IImageOnLoadType {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  // Triggered when full image will be loaded.
  const handleImageOnLoad = () => {
    setIsLoaded(true)
  }

  const css: IImageStyle = {
    // Thumbnail style.
    thumbnail: {
      visibility: isLoaded ? 'hidden' : 'visible',
      filter: 'blur(8px)',
      transition: 'visibility 0ms ease-out 500ms',
    },
    // Full image style.
    fullSize: {
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 500ms ease-in 0ms',
    },
  }

  return { handleImageOnLoad, css }
}

export { useImageOnLoad }
