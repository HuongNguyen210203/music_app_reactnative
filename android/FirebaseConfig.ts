import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0_if_J3ng3_Yb7VWWtwpOr2aAXUcM-Ic",
    authDomain: "reanatauth.firebaseapp.com",
    projectId: "reanatauth",
    storageBucket: "reanatauth.appspot.com", // Default storage bucket
    messagingSenderId: "550340552858",
    appId: "1:550340552858:web:7d36557a0e188d57c0d723",
    measurementId: "G-RSFTCW7HNC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(firebaseApp);
const FIREBASE_DB = getFirestore(firebaseApp);
const FIREBASE_STORAGE = getStorage(firebaseApp); // Chỉ gọi một lần

// Set persistence
setPersistence(FIREBASE_AUTH, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to browserLocalPersistence.");
    })
    .catch((error) => {
        console.error("Error setting persistence: ", error);
    });

// Export the initialized Firebase app and services
export { firebaseApp, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE };

