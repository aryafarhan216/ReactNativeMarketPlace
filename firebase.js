// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4uk7uFi7t1M8aTokeLyS0pTEhU5FsUIU",
  authDomain: "fir-sbc.firebaseapp.com",
  projectId: "fir-sbc",
  storageBucket: "fir-sbc.appspot.com",
  messagingSenderId: "676594783389",
  appId: "1:676594783389:web:c991bcded25f74cbaef074"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore(app)
export const storage = getStorage(app);
