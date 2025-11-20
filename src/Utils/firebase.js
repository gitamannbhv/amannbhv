import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Using hardcoded keys to prevent white-screen crashes due to missing .env
const firebaseConfig = {
  apiKey: "AIzaSyAA_HoCCSagZNg31t642wjwxIRrkIPU4uQ",
  authDomain: "amannbhv-m.firebaseapp.com",
  projectId: "amannbhv-m",
  storageBucket: "amannbhv-m.firebasestorage.app",
  messagingSenderId: "499252124944",
  appId: "1:499252124944:web:6a64ac80518d04873a1995"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export { app, auth, db };