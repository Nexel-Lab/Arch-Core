// type TUploadOptions = {
//   bucketSuffix?: string
//   fileName?: string
//   flag?: string
//   metadata?: Record<string, string>
// }

const uploadFile = (file: File, urlEndpoint = '/api/upload') => {
  return new Promise<object>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', urlEndpoint)
    xhr.setRequestHeader(
      'Content-Type',
      file.type || 'application/octet-stream',
    )
    xhr.setRequestHeader('Content-Length', file.size.toString())
    xhr.onloadend = () => {
      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch (_error) {
          reject(new Error('Failed to parse JSON response'))
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }
    xhr.onerror = () => reject(new Error('Upload request failed'))
    xhr.onabort = () => reject(new Error('Upload aborted'))
    xhr.send(file)

    // Cleanup function to avoid memory issues
    return () => xhr.abort()
  })
}

export { uploadFile }
