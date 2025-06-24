'use client'

import { useCallback, useRef, useState } from 'react'
import { type ITrackedFile, UPLOAD_STATUS } from './_header'

interface IUploadResult {
  id: string
  url: string
}

interface IPresignedResponse {
  id: string
  url: string
  error?: string
}

type TUploadToS3 = (
  file: File,
  fileName?: string,
  metadata?: Record<string, string>,
) => Promise<IUploadResult>

interface IUseS3UploadTools {
  uploadToS3: TUploadToS3
  files: ITrackedFile[]
  removeFile: (fileId: string) => void
  resetFiles: () => void
  isUploading: boolean
  getFileById: (fileId: string) => ITrackedFile | undefined
}

const DEFAULT_PENDING_FILE: Omit<ITrackedFile, 'id' | 'url' | 'name'> = {
  progress: 0,
  uploaded: 0,
  size: 0,
  speed: 0,
  timeRemaining: 0,
  status: UPLOAD_STATUS.PENDING,
  abort: () => undefined,
}

/**
 * Custom hook for handling S3 presigned URL uploads with progress tracking
 *
 * @param apiUrl - The API endpoint for generating presigned S3 URLs
 * @param options - Optional configuration for the hook
 * @returns Object containing upload tools and state
 */
export const usePresignedS3Upload = (
  apiUrl: string,
  options?: {
    headers?: Record<string, string>
    onUploadSuccess?: (file: ITrackedFile) => void
    onUploadError?: (error: Error, file?: ITrackedFile) => void
    autoRetry?: boolean
    maxRetries?: number
  },
): IUseS3UploadTools => {
  const [files, setFiles] = useState<ITrackedFile[]>([])
  const uploadsInProgress = useRef<Set<string>>(new Set())

  const isUploading = files.some(
    (file) => file.status === UPLOAD_STATUS.UPLOADING,
  )

  const {
    headers = {},
    onUploadSuccess,
    onUploadError,
    autoRetry = false,
    maxRetries = 3,
  } = options || {}

  /**
   * Reset all tracked files
   */
  const resetFiles = useCallback(() => {
    // Abort any in-progress uploads before resetting
    for (const file of files) {
      if (file.status === UPLOAD_STATUS.UPLOADING) {
        file.abort()
      }
    }
    uploadsInProgress.current.clear()
    setFiles([])
  }, [files])

  /**
   * Get a file by its ID
   */
  const getFileById = useCallback(
    (fileId: string) => {
      return files.find((file) => file.id === fileId)
    },
    [files],
  )

  /**
   * Remove a specific file from tracking
   */
  const removeFile = useCallback((fileId: string) => {
    setFiles((currentFiles) => {
      const fileToRemove = currentFiles.find((file) => file.id === fileId)
      if (fileToRemove?.status === UPLOAD_STATUS.UPLOADING) {
        fileToRemove.abort()
      }
      uploadsInProgress.current.delete(fileId)
      return currentFiles.filter((file) => file.id !== fileId)
    })
  }, [])

  /**
   * Update a specific file in the tracked files array
   */
  const updateFile = useCallback(
    (id: string, updates: Partial<ITrackedFile>) => {
      setFiles((currentFiles) =>
        currentFiles.map((file) =>
          file.id === id ? { ...file, ...updates } : file,
        ),
      )
    },
    [],
  )

  /**
   * Upload a file to S3 using a presigned URL
   */
  const uploadToS3: TUploadToS3 = useCallback(
    (file, fileName = file.name, metadata = {}) => {
      let retryCount = 0
      const actualFileName = fileName || file.name || `file-${Date.now()}`

      // Function to handle the core upload process
      const performUpload = async (): Promise<IUploadResult> => {
        try {
          // Get presigned URL from API
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: JSON.stringify({
              fileName: actualFileName,
              contentType: file.type,
              metadata,
            }),
          })

          if (!response.ok) {
            throw new Error(
              `Failed to get presigned URL: ${response.status} ${response.statusText}`,
            )
          }

          const data: IPresignedResponse = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          const { id, url } = data

          if (!id || !url) {
            throw new Error('Invalid response from presigned URL endpoint')
          }

          // Create XMLHttpRequest for upload with progress tracking
          const xhr = new XMLHttpRequest()
          uploadsInProgress.current.add(id)

          // Create the tracked file object
          const trackedFile: ITrackedFile = {
            ...DEFAULT_PENDING_FILE,
            id,
            url,
            name: actualFileName,
            size: file.size,
            originalFile: file,
            abort: () => {
              if (xhr.readyState !== 4) {
                xhr.abort()
              }
            },
          }

          // Add the tracked file to state
          setFiles((currentFiles) => [...currentFiles, trackedFile])

          // Upload the file and track progress
          await new Promise<boolean>((resolve, reject) => {
            let uploadStart = Date.now()

            xhr.upload.addEventListener('loadstart', () => {
              uploadStart = Date.now()
              updateFile(id, { status: UPLOAD_STATUS.UPLOADING })
            })

            xhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                const uploaded = event.loaded
                const size = event.total
                const secondsElapsed = (Date.now() - uploadStart) / 1000
                const speed = secondsElapsed > 0 ? uploaded / secondsElapsed : 0
                const timeRemaining = speed > 0 ? (size - uploaded) / speed : 0
                const progress =
                  size > 0
                    ? Math.min(Math.round((uploaded / size) * 100), 100)
                    : 0

                updateFile(id, {
                  uploaded,
                  size,
                  progress,
                  timeRemaining,
                  speed,
                  status: UPLOAD_STATUS.UPLOADING,
                })
              }
            })

            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                updateFile(id, { status: UPLOAD_STATUS.SUCCESS, progress: 100 })
                uploadsInProgress.current.delete(id)
                const fileById = getFileById(id)
                if (fileById) {
                  onUploadSuccess?.(fileById)
                }
                resolve(true)
              } else {
                const errorMsg = `Upload failed with status ${xhr.status}: ${xhr.statusText}`
                updateFile(id, { status: UPLOAD_STATUS.ERROR })
                uploadsInProgress.current.delete(id)
                reject(new Error(errorMsg))
              }
            })

            xhr.addEventListener('error', () => {
              updateFile(id, { status: UPLOAD_STATUS.ERROR })
              uploadsInProgress.current.delete(id)
              reject(new Error('Network error during upload'))
            })

            xhr.addEventListener('abort', () => {
              updateFile(id, { status: UPLOAD_STATUS.ABORTED })
              uploadsInProgress.current.delete(id)
              reject(new Error('Upload aborted'))
            })

            xhr.open('PUT', url)

            // Set headers as needed for S3
            xhr.setRequestHeader(
              'Content-Type',
              file.type || 'application/octet-stream',
            )

            // Add custom metadata headers if provided
            for (const [key, value] of Object.entries(metadata)) {
              xhr.setRequestHeader(`x-amz-meta-${key.toLowerCase()}`, value)
            }

            xhr.send(file)
          })

          return { id, url }
        } catch (error) {
          const trackedFile = files.find((f) => f.originalFile === file)
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown upload error'

          if (trackedFile) {
            updateFile(trackedFile.id, { status: UPLOAD_STATUS.ERROR })
            uploadsInProgress.current.delete(trackedFile.id)
          }

          onUploadError?.(
            error instanceof Error ? error : new Error(errorMessage),
            trackedFile,
          )

          // Handle retry logic
          if (autoRetry && retryCount < maxRetries) {
            retryCount++
            console.log(`Retrying upload (${retryCount}/${maxRetries})...`)
            return performUpload()
          }

          throw error
        }
      }

      return performUpload()
    },
    [
      apiUrl,
      files,
      getFileById,
      headers,
      maxRetries,
      autoRetry,
      onUploadError,
      onUploadSuccess,
      updateFile,
    ],
  )

  return {
    uploadToS3,
    files,
    removeFile,
    resetFiles,
    isUploading,
    getFileById,
  }
}
