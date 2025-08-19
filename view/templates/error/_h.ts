import type { UrlObject } from 'node:url'
import type { IconType } from 'react-icons'

export interface IErrorComponentProps {
  Icon: IconType
  name: string
  description?: string
  fallback?: { title: string; url: UrlObject }[]
}
