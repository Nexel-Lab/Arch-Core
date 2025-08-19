import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { firebaseApp as app } from './initialize'

export const storageInstance = getStorage(app)

export const getFile = async (
  fileName: string | undefined,
  folderName?: string,
) => {
  const dbPath =
    fileName && folderName
      ? `${folderName}/${fileName}`
      : !folderName && fileName
        ? fileName
        : ''
  const storageRef = ref(storageInstance, dbPath)
  try {
    const imgUrl = await getDownloadURL(storageRef)
    if (!imgUrl) {
      return {
        success: false,
        message: 'no data',
      }
    }

    return {
      success: true,
      data: imgUrl,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'database connection failed',
    }
  }
}

export interface IFile {
  file: File
  fileName: string
  folderName?: string
}

export const putFile = async ({ file, fileName, folderName }: IFile) => {
  const dbPath = folderName ? `${folderName}/${fileName}` : fileName
  const storageRef = ref(storageInstance, dbPath)
  try {
    const uploadFileResponse = await uploadBytes(storageRef, file)
    if (!uploadFileResponse) {
      return {
        success: false,
        message: 'upload fail',
      }
    }
    return {
      success: true,
      metadata: uploadFileResponse.metadata,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'database connection failed',
    }
  }
}
