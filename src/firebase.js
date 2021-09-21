import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDtT6kAP6yEgE4TwzCB1SfsUbpcL-KsMk",
  authDomain: "nwitter-52649.firebaseapp.com",
  projectId: "nwitter-52649",
  storageBucket: "nwitter-52649.appspot.com",
  messagingSenderId: "373632119746",
  appId: "1:373632119746:web:e029e3cc94b45ae248dc5b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
