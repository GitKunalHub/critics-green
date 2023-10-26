import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsHjcr8CRIt_N1KFO8gfgNzYqb58RsRQs",
  authDomain: "critics-green.firebaseapp.com",
  projectId: "critics-green",
  storageBucket: "critics-green.appspot.com",
  messagingSenderId: "408505968348",
  appId: "1:408505968348:web:5bb766e69d670fff55b619",
  measurementId: "G-9KXPGQCR1T",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
