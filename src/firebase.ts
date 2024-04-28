// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyJ5IAMihlN9fEJJTM-lHlx-8lW5c83BU",
  authDomain: "myitter-reloaded.firebaseapp.com",
  projectId: "myitter-reloaded",
  storageBucket: "myitter-reloaded.appspot.com",
  messagingSenderId: "708357590494",
  appId: "1:708357590494:web:4e799f460bec5c5f55a14f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
