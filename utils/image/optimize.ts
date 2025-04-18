'use server'

import sharp from 'sharp'

const optimizeAndConvertToJpg = async (
  inputArray: ArrayBuffer,
  option: {
    maxWidth: number
    maxHeight: number
    quality: number
  } = {
    maxWidth: 512,
    maxHeight: 512,
    quality: 80,
  },
  quality = 80,
): Promise<Buffer> => {
  try {
    const jpegBuffer = await sharp(inputArray)
      .toFormat('jpeg')
      .resize(option.maxWidth, option.maxHeight)
      .jpeg({ quality })
      .toBuffer()

    return jpegBuffer
  } catch (_error) {
    throw new Error('Error while optimizing and converting to JPEG')
  }
}

const optimizeAndConvertToPng = async (
  inputArray: ArrayBuffer,
  option: {
    maxWidth: number
    maxHeight: number
    quality: number
  } = {
    maxWidth: 512,
    maxHeight: 512,
    quality: 80,
  },
  quality = 80,
): Promise<Buffer> => {
  try {
    const jpegBuffer = await sharp(inputArray)
      .toFormat('png')
      .resize(option.maxWidth, option.maxHeight)
      .png({ quality })
      .toBuffer()

    return jpegBuffer
  } catch (_error) {
    throw new Error('Error while optimizing and converting to PNG')
  }
}

export { optimizeAndConvertToJpg, optimizeAndConvertToPng }
