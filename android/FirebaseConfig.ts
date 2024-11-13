// import { initializeApp } from "firebase/app";
// import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // Import Firebase Storage
// import { getDatabase } from "firebase/database"; // Import Firebase Realtime Database
//
// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyA0_if_J3ng3_Yb7VWWtwpOr2aAXUcM-Ic",
//     authDomain: "reanatauth.firebaseapp.com",
//     projectId: "reanatauth",
//     storageBucket: "reanatauth.appspot.com", // Default storage bucket
//     messagingSenderId: "550340552858",
//     appId: "1:550340552858:web:7d36557a0e188d57c0d723",
//     measurementId: "G-RSFTCW7HNC",
// };
//
// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const FIREBASE_AUTH = getAuth(firebaseApp);
// const FIREBASE_DB = getFirestore(firebaseApp);
// const FIREBASE_STORAGE = getStorage(firebaseApp); // Chỉ gọi một lần
// const FIREBASE_DATABASE = getDatabase(firebaseApp); // Chỉ gọi một lần
//
//
// // Set persistence
// setPersistence(FIREBASE_AUTH, browserLocalPersistence)
//     .then(() => {
//         console.log("Persistence set to browserLocalPersistence.");
//     })
//     .catch((error) => {
//         console.error("Error setting persistence: ", error);
//     });
//
// // Export the initialized Firebase app and services
// export { firebaseApp, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_DATABASE };
//
// FirebaseConfig.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0_if_J3ng3_Yb7VWWtwpOr2aAXUcM-Ic",
    authDomain: "reanatauth.firebaseapp.com",
    projectId: "reanatauth",
    databaseURL: 'https://reanatauth-default-rtdb.firebaseio.com',
    storageBucket: "reanatauth.appspot.com",
    messagingSenderId: "550340552858",
    appId: "1:550340552858:web:7d36557a0e188d57c0d723",
    measurementId: "G-RSFTCW7HNC",
};

// Initialize Firebase app only if it hasn't been initialized
let firebaseApp;

if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp(); // Use the existing app
}

const FIREBASE_AUTH = getAuth(firebaseApp);
const FIREBASE_DB = getFirestore(firebaseApp);
const FIREBASE_STORAGE = getStorage(firebaseApp);
const FIREBASE_DATABASE = getDatabase(firebaseApp);

// Set persistence
setPersistence(FIREBASE_AUTH, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to browserLocalPersistence.");
    })
    .catch((error) => {
        console.error("Error setting persistence: ", error);
    });

// Export the initialized Firebase app and services
export { firebaseApp, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_DATABASE };
