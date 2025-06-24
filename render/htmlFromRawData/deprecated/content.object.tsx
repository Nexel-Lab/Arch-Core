/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from 'next/image'
import { cn } from '../../../view/styles'
import type {
  CONTENT_BLOCK,
  TContent,
  TImageContent,
  TTextContent,
} from './_header'

const Text = ({ block }: { block: TTextContent[] }) => {
  return (
    <>
      {block.map(({ text, bold }, i: number) => {
        return bold ? (
          <strong className='px-0.5 font-semibold text-primary' key={i}>
            {text}
          </strong>
        ) : (
          text
        )
      })}
    </>
  )
}

interface BlockComponent {
  block: Partial<{
    type: string
    className: string
    children: TTextContent[] | TImageContent[] | TContent[]
    src: string
    altText: string
    height: number
    width: number
    handle: string
    mimeType: string
  }>
}

type BlockComponentsType = {
  [Key in CONTENT_BLOCK]: React.FC<BlockComponent>
}

const BlockComponents: BlockComponentsType = {
  paragraph: ({ block }) => (
    <p className='py-2 text-[#5c5c5c] dark:text-[#bbbbbb]'>
      &emsp;&emsp;&emsp;
      <Text block={block.children as TTextContent[]} />
    </p>
  ),
  'heading-one': ({ block }) => (
    <h1 className='pt-16 pb-4 font-semibold text-3xl lg:pt-24 lg:text-5xl'>
      <Text block={block.children as TTextContent[]} />
    </h1>
  ),
  'heading-two': ({ block }) => (
    <h2 className='pt-16 pb-4 font-semibold text-2xl lg:pt-24 lg:text-4xl'>
      <Text block={block.children as TTextContent[]} />
    </h2>
  ),
  'heading-three': ({ block }) => (
    <h3 className='pt-16 pb-4 font-semibold text-xl lg:pt-24 lg:text-3xl'>
      <Text block={block.children as TTextContent[]} />
    </h3>
  ),
  'heading-four': ({ block }) => (
    <h4 className='py-4 pl-4 font-semibold text-lg lg:py-8 lg:pl-8 lg:text-xl'>
      <Text block={block.children as TTextContent[]} />
    </h4>
  ),
  'heading-five': ({ block }) => (
    <h5 className='py-8 pl-8 font-semibold lg:text-lg'>
      <Text block={block.children as TTextContent[]} />
    </h5>
  ),
  'heading-six': ({ block }) => (
    <h6 className='py-8 pl-6 font-light text-xl italic lg:py-16 lg:pl-12 lg:text-3xl lg:leading-10'>
      <Text block={block.children as TTextContent[]} />
    </h6>
  ),
  image: ({ block }) =>
    block.src &&
    block.altText && (
      <div className='flex w-full justify-center py-8'>
        <Image
          alt={block.altText}
          blurDataURL={
            'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
          }
          className='overflow-hidden rounded-lg'
          height={block.height}
          objectFit='cover'
          // fill
          placeholder='blur'
          src={block.src}
          width={block.width}
        />
      </div>
    ),
  class: ({ block }) => (
    <div className={cn(block.className)}>
      <HTMLFromRaw raw={block.children as TContent[]} />
    </div>
  ),
  'block-quote': ({ block }) => (
    <blockquote className='my-6 rounded-md border-4 border-y-white/0 border-r-white/0 border-l-quaternary-2 bg-black/5 p-6 font-light text-xl lg:my-12 lg:text-2xl lg:leading-10 dark:border-l-primary-0 dark:bg-black/40'>
      <Text block={block.children as TTextContent[]} />
    </blockquote>
  ),
}

const HTMLFromRaw = ({ raw }: { raw: TContent[] }) => {
  return (
    <>
      {raw.map((block, index) => {
        const Component = BlockComponents[block.type as CONTENT_BLOCK]
        return Component ? <Component block={block} key={index} /> : null
      })}
    </>
  )
}

export { HTMLFromRaw, Text }
