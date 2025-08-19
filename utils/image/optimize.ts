'use server'

import sharp from 'sharp'

const optimizeAndConvertToJpg = async (
  input: sharp.SharpInput | sharp.SharpInput[],
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
    const jpegBuffer = await sharp(input)
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
  input: sharp.SharpInput | sharp.SharpInput[],
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
    const jpegBuffer = await sharp(input)
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
