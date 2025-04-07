const toBase64 = (data: BlobPart[] | []) => {
  const blob = new Blob(data, { type: 'mime/type' })
  const reader = new FileReader()

  let base64String: string | undefined

  reader.onload = () => {
    base64String =
      reader.result && typeof reader.result === 'string'
        ? reader.result.split(',')[1]
        : undefined
    // Use base64String
  }
  reader.readAsDataURL(blob)
  return base64String
}

export { toBase64 }
