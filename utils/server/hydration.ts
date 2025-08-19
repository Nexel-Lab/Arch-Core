import { useMemo } from 'react'
import type { SuperJSONResult } from 'superjson'
import superjson from 'superjson'

const symbol = Symbol('__RSC_DATA__')

export type TSerializedResult<T> = SuperJSONResult & { [symbol]: T }

export function serialize<T>(obj: T): TSerializedResult<T> {
  return superjson.serialize(obj) as unknown as TSerializedResult<T>
}

export function deserialize<T>(obj: TSerializedResult<T>): T {
  return superjson.deserialize(obj) as T
}

export function useDeserialized<T>(obj: TSerializedResult<T>): T {
  return useMemo(() => deserialize(obj), [obj])
}
