export enum UPLOAD_STATUS {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error',
  ABORTED = 'aborted',
  BLOCKED = 'blocked',
}

export interface ITrackedFile {
  id: string
  url: string
  name: string
  progress: number
  uploaded: number
  size: number
  speed: number
  timeRemaining: number
  status: UPLOAD_STATUS
  abort: () => void
  originalFile?: File
}
