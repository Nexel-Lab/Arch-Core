type TUploadResult = { key: string }

type TUploadToS3 = (
  file: File | ArrayBuffer,
  fileName: string,
  bucketSuffix?: string,
  metadata?: Record<string, string>,
) => Promise<TUploadResult>

const presignedUpload: TUploadToS3 = async (
  file,
  dir,
  bucketSuffix = undefined,
) => {
  const fetchUrl = `/api/upload/presigned?name=${dir}${
    bucketSuffix ? `&bucketSuffix=${bucketSuffix}` : ''
  }`

  const res = await fetch(fetchUrl)
  if (!res.ok) throw new Error('Failed to get presigned upload url')

  const data = await res.json()
  if ('error' in data) throw new Error(data.error)

  const { key, url } = data

  return new Promise<TUploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')

    xhr.onloadend = () => {
      if (xhr.status === 200) {
        resolve({ key })
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }

    xhr.onerror = () => reject(new Error('Upload request failed'))
    xhr.onabort = () => reject(new Error('Upload aborted'))

    xhr.send(file instanceof File ? file : new Blob([file]))

    // Cleanup function to avoid memory issues
    return () => xhr.abort()
  })
}

export { presignedUpload }
