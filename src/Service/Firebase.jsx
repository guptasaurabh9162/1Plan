import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID

  // apiKey: "AIzaSyAOMCPRrCldF3_kM4t7T9XQAOQYO61y-08",
  // authDomain: "w2gcode04.firebaseapp.com",
  // projectId: "w2gcode04",
  // storageBucket: "w2gcode04.firebasestorage.app",
  // messagingSenderId: "830738087911",
  // appId: "1:830738087911:web:c2b87a7c0be93d92c0c742",
  // measurementId: "G-1PG3LG9EFV"

};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
