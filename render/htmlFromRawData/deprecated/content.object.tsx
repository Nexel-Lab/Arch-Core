/* eslint-disable @typescript-eslint/no-explicit-any */
import { Content, ImageContent, TextContent } from 'types'
import Image from 'next/image'
import { cn } from '@/libs/styles'
import { POST } from '@/enums/content'

const Text = ({ block }: { block: TextContent[] }) => {
  return (
    <>
      {block.map(({ text, bold }, i: number) => {
        return bold ? (
          <strong key={i} className='text-primary px-0.5 font-semibold'>
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
    children: TextContent[] | ImageContent[] | Content[]
    src: string
    altText: string
    height: number
    width: number
    handle: string
    mimeType: string
  }>
}

type BlockComponentsType = {
  [Key in POST.CONTENT_BLOCK]: React.FC<BlockComponent>
}

const BlockComponents: BlockComponentsType = {
  paragraph: ({ block }) => (
    <p className='py-2 text-[#5c5c5c] dark:text-[#bbbbbb]'>
      &emsp;&emsp;&emsp;
      <Text block={block.children as TextContent[]} />
    </p>
  ),
  'heading-one': ({ block }) => (
    <h1 className='pt-16 pb-4 text-3xl font-semibold lg:pt-24 lg:text-5xl'>
      <Text block={block.children as TextContent[]} />
    </h1>
  ),
  'heading-two': ({ block }) => (
    <h2 className='pt-16 pb-4 text-2xl font-semibold lg:pt-24 lg:text-4xl'>
      <Text block={block.children as TextContent[]} />
    </h2>
  ),
  'heading-three': ({ block }) => (
    <h3 className='pt-16 pb-4 text-xl font-semibold lg:pt-24 lg:text-3xl'>
      <Text block={block.children as TextContent[]} />
    </h3>
  ),
  'heading-four': ({ block }) => (
    <h4 className='py-4 pl-4 text-lg font-semibold lg:py-8 lg:pl-8 lg:text-xl'>
      <Text block={block.children as TextContent[]} />
    </h4>
  ),
  'heading-five': ({ block }) => (
    <h5 className='py-8 pl-8 font-semibold lg:text-lg'>
      <Text block={block.children as TextContent[]} />
    </h5>
  ),
  'heading-six': ({ block }) => (
    <h6 className='py-8 pl-6 text-xl font-light italic lg:py-16 lg:pl-12 lg:text-3xl lg:leading-10'>
      <Text block={block.children as TextContent[]} />
    </h6>
  ),
  image: ({ block }) =>
    block.src &&
    block.altText && (
      <div className='flex w-full justify-center py-8'>
        <Image
          className='overflow-hidden rounded-lg'
          src={block.src}
          alt={block.altText}
          height={block.height}
          width={block.width}
          // fill
          objectFit='cover'
          placeholder='blur'
          blurDataURL={
            'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
          }
        />
      </div>
    ),
  class: ({ block }) => (
    <div className={cn(block.className)}>
      <HTMLFromRaw raw={block.children as any} />
    </div>
  ),
  'block-quote': ({ block }) => (
    <blockquote className='border-l-quaternary-2 dark:border-l-primary-0 my-6 rounded-md border-4 border-y-white/0 border-r-white/0 bg-black/5 p-6 text-xl font-light lg:my-12 lg:text-2xl lg:leading-10 dark:bg-black/40'>
      <Text block={block.children as TextContent[]} />
    </blockquote>
  ),
}

const HTMLFromRaw = ({ raw }: { raw: Content[] }) => {
  return (
    <>
      {raw.map((block, index) => {
        const Component = BlockComponents[block.type as POST.CONTENT_BLOCK]
        return Component ? <Component key={index} block={block} /> : null
      })}
    </>
  )
}

export { HTMLFromRaw, Text }
