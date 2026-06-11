import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAs5FIOxtcsgOqrw0rlcr2e47f19X1EALE",
  projectId: "campo-santa",
  appId: "1:682891850839:web:f1aaf0befd920e65411f12"
}

const app = initializeApp(firebaseConfig)
const dbFirebase = getFirestore(app)

export default dbFirebase
