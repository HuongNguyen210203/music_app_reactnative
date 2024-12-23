import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


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


let firebaseApp;

if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp(); // Use the existing app
}

const FIREBASE_AUTH = getAuth(firebaseApp);
const FIREBASE_DB = getFirestore(firebaseApp); // Make sure Firestore is initialized correctly
const FIREBASE_STORAGE = getStorage(firebaseApp);
const FIREBASE_DATABASE = getDatabase(firebaseApp);


setPersistence(FIREBASE_AUTH, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to browserLocalPersistence.");
    })
    .catch((error) => {
        console.error("Error setting persistence: ", error);
    });


export { firebaseApp, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_DATABASE };
