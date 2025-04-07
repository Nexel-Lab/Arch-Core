import { getFirestore } from 'firebase/firestore'
import { firebaseApp as app } from './initialize'

export const firestoreInstance = getFirestore(app)
