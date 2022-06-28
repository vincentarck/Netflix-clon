// Import the functions you need from the SDKs you need
import { getApp, initializeApp, getApps } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtrhVEOtYAhAB8B_pKe9myDASBJjTULgY",
  authDomain: "netflixclone-e4a99.firebaseapp.com",
  projectId: "netflixclone-e4a99",
  storageBucket: "netflixclone-e4a99.appspot.com",
  messagingSenderId: "807469906225",
  appId: "1:807469906225:web:f076d4edcc20cf73249810",
  measurementId: "G-TFHMLNF38K"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }