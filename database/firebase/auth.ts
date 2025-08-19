import { getAuth } from 'firebase/auth'
import { firebaseApp as app } from './initialize'

export const authInstance = getAuth(app)
export { useFirebaseAuth } from './auth.management'
export { useAuthStore } from './auth.store'
