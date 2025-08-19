export type TTextContent = {
  text: string
  bold?: boolean
}

export type TImageContent = {
  src: string
  altText: string
  height: number
  width: number
}

export type TBaseContent = {
  type: CONTENT_BLOCK_TYPE
  className?: string
  children: (TTextContent | TImageContent | TContent)[]
}

export type TContent = TBaseContent & Partial<TImageContent>

export type TRawContent = {
  content: TBaseContent
}

// Strict type definition for content block types
export enum CONTENT_BLOCK_TYPE {
  Paragraph = 'paragraph',
  HeadingOne = 'heading-one',
  HeadingTwo = 'heading-two',
  HeadingThree = 'heading-three',
  HeadingFour = 'heading-four',
  HeadingFive = 'heading-five',
  HeadingSix = 'heading-six',
  Image = 'image',
  Class = 'class',
  BlockQuote = 'block-quote',
}

export const HEADING_STYLES = {
  [CONTENT_BLOCK_TYPE.HeadingOne]:
    'pt-16 pb-4 text-3xl font-semibold lg:pt-24 lg:text-5xl',
  [CONTENT_BLOCK_TYPE.HeadingTwo]:
    'pt-16 pb-4 text-2xl font-semibold lg:pt-24 lg:text-4xl',
  [CONTENT_BLOCK_TYPE.HeadingThree]:
    'pt-16 pb-4 text-xl font-semibold lg:pt-24 lg:text-3xl',
  [CONTENT_BLOCK_TYPE.HeadingFour]:
    'py-4 pl-4 text-lg font-semibold lg:py-8 lg:pl-8 lg:text-xl',
  [CONTENT_BLOCK_TYPE.HeadingFive]: 'py-8 pl-8 font-semibold lg:text-lg',
  [CONTENT_BLOCK_TYPE.HeadingSix]:
    'py-8 pl-6 text-xl font-light italic lg:py-16 lg:pl-12 lg:text-3xl lg:leading-10',
} as const
