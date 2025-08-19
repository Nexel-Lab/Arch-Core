const useFetchQL = async (
  endpointURL: string | undefined | null,
  ql: { query: string; variables?: Record<string, string> },
  options?: RequestInit & { revalidate?: number },
  callback?: () => void,
) => {
  if (!endpointURL) {
    throw new Error('no api endpoint that request')
  }

  const res = await fetch(endpointURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(ql),
    next: { revalidate: options?.revalidate || 0, ...options?.next },
  }).then((res) => res.json())

  if (callback) {
    callback()
  }

  if (!res.data) {
    throw res.errors[0]?.message
  }

  return res.data
}

export { useFetchQL }
