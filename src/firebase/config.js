// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9XdTGVi3OtBNg_zq-xunT-PtCvf8lV1k",
  authDomain: "ct-challenge-d7d8e.firebaseapp.com",
  projectId: "ct-challenge-d7d8e",
  storageBucket: "ct-challenge-d7d8e.appspot.com",
  messagingSenderId: "273371709428",
  appId: "1:273371709428:web:7a8c033f5261459a1543a1",
  measurementId: "G-RNZ6QG2ZK2"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//export const auth = getAuth(app)
export const firebaseDB = getFirestore(app)
export const storage = getStorage(app)