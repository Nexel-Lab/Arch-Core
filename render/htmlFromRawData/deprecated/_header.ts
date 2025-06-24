export type TTextContent = { bold?: boolean; text: string }

export type TImageContent = {
  type: string
  src: string
  altText: string
  height: number
  width: number
  handle?: string
  mimeType?: string
  children?: TContent[]
}

export type TContent =
  | {
      type?: string
      className?: string
      children: TTextContent[] | TImageContent[] | TContent[]
    }
  | TImageContent

export type TRaw = {
  children: TContent[]
}

export type TRawContent = {
  children: TTextContent[] | TImageContent[] | TContent[]
}

export enum CONTENT_BLOCK {
  PARAGRAPH = 'paragraph',
  HEADING_ONE = 'heading-one',
  HEADING_TWO = 'heading-two',
  HEADING_THREE = 'heading-three',
  HEADING_FOUR = 'heading-four',
  HEADING_FIVE = 'heading-five',
  HEADING_SIX = 'heading-six',
  IMAGE = 'image',
  CLASS = 'class',
  BLOCK_QUOTE = 'block-quote',
}
