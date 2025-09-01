import type { Metadata } from 'next'

export interface IMetadata {
  appName: string
  title: string
  url: string
  description: {
    default: string
    og?: string
    twitter?: string
  }
  coverImg: string
  author: string
  keywords: string | string[]
  twitterID: string
}

export const getMetadata = (metaData: IMetadata): Metadata => ({
  metadataBase: new URL(metaData.url),
  title: {
    template: `%s | ${metaData.appName}`,
    default: metaData.title,
  },
  description: metaData.description.default,
  applicationName: metaData.appName,
  keywords: metaData.keywords,
  authors: { name: metaData.author },
  creator: metaData.author,
  publisher: metaData.author,
  other: {
    designer: metaData.author,
    language: 'english',
    distribution: 'web',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: {
      template: `%s | ${metaData.appName}`,
      default: metaData.title,
    },
    siteName: metaData.appName,
    description: metaData.description.og ?? metaData.description.default,
    images: [
      {
        url: metaData.coverImg,
        width: 1200,
        height: 627,
      },
    ],
    authors: [metaData.author],
    locale: 'en-US',
    // type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: `%s | ${metaData.appName}`,
      default: metaData.title,
    },
    description: metaData.description.og ?? metaData.description.default,
    // siteId: '1467726470533754880',
    creator: metaData.twitterID,
    // creatorId: '1467726470533754880',
    images: [metaData.coverImg],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/favicon.ico',
    },
  },
  // robots: {
  //   index: true,
  //   follow: true,
  //   nocache: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //   },
  // },
  appleWebApp: {
    title: metaData.appName,
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/app/startup/apple-touch-startup-image-768x1004.png',
      {
        url: '/app/startup/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
})
