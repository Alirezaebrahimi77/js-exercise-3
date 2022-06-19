import {initializeApp} from "firebase/app"
import {getFirestore, collection, query, orderBy} from "firebase/firestore"

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSEGING_SENDING_ID,
    appId: process.env.APP_ID
  };


initializeApp(firebaseConfig)

// init database
export const db = getFirestore()

// collection ref
export const colRef = collection(db, "emojis")
export const q = query(colRef, orderBy('createdAt'))
