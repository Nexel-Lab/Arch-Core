import { get, getDatabase, ref } from 'firebase/database'
import { firebaseApp as app } from './initialize'

const db = getDatabase(app)

export const findOne = async (
  dbName: string | undefined,
  folderName?: string,
) => {
  const dbPath =
    dbName && folderName
      ? `${folderName}/${dbName}`
      : !folderName && dbName
        ? dbName
        : ''
  const playersRef = ref(db, dbPath)
  try {
    const allData = await get(playersRef)
    if (allData.exists()) {
      return { success: true, data: allData.val() }
    }
    return {
      success: false,
      message: 'no data',
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'database connection failed',
    }
  }
}

export const findAll = async () => {
  return await findOne('')
}

export { db as databaseInstance }
