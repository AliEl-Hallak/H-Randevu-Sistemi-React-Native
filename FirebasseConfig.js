// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGUFUN6P9aeBc_-vFY1J2sN0jpyrMwX_8",
  authDomain: "mobilproje-d1d78.firebaseapp.com",
  projectId: "mobilproje-d1d78",
  storageBucket: "mobilproje-d1d78.appspot.com",
  messagingSenderId: "818351889069",
  appId: "1:818351889069:web:1882522f1b099276734424"
  };
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);