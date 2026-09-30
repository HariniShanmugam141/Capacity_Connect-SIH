// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, get, child } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9S62ixltG9HqahJpf3gSuSDex4J5tG2k",
  authDomain: "capacityconnect-e877c.firebaseapp.com",
  projectId: "capacityconnect-e877c",
  storageBucket: "capacityconnect-e877c.firebasestorage.app",
  messagingSenderId: "842336812597",
  appId: "1:842336812597:web:2fc263d7cec2efcbccfb7c",
  measurementId: "G-RT2J48TMMH",
  databaseURL: "https://capacityconnect-e877c-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally
let analytics;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Analytics not initialized", e);
  }
}

// Initialize Auth, Firestore, and Realtime Database
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const db = getFirestore(app);
const rtdb = getDatabase(app, "https://capacityconnect-e877c-default-rtdb.asia-southeast1.firebasedatabase.app");

export { 
  app, 
  analytics, 
  auth, 
  googleProvider, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  db, 
  rtdb, 
  ref, 
  set, 
  get, 
  child 
};
