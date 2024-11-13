// // FirebaseDataService.js
//
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { ref, get, child } from "firebase/database";
// import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig"; // Import initialized services
//
// // Fetch all documents from a Firestore collection
// export async function fetchCollectionData() {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//         return musicData;
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// }
//
// // Fetch a specific document from Firestore by ID
// export async function fetchDocumentData(docId) {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             console.log("Fetched document data:", docSnapshot.data());
//             return { id: docSnapshot.id, ...docSnapshot.data() };
//         } else {
//             console.log("No such document in Firestore");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// }
//
// // Fetch data from Firebase Realtime Database at a specific path
// export async function fetchRealtimeData(path) {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         if (snapshot.exists()) {
//             console.log("Fetched Realtime Database data:", snapshot.val());
//             return snapshot.val();
//         } else {
//             console.log("No data available in Realtime Database at", path);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// // }
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { ref, get, child } from "firebase/database";
// import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig"; // Import initialized services
//
// // Initialize an empty queue
// const dataQueue = [];
//
// // Fetch all documents from a Firestore collection
// export async function fetchCollectionData() {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//
//         // Push the fetched data into the queue
//         dataQueue.push(...musicData);
//
//         return musicData;
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// }
//
// // Fetch a specific document from Firestore by ID
// export async function fetchDocumentData(docId) {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             const data = { id: docSnapshot.id, ...docSnapshot.data() };
//             console.log("Fetched document data:", data);
//
//             // Push the fetched data into the queue
//             dataQueue.push(data);
//
//             return data;
//         } else {
//             console.log("No such document in Firestore");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// }
//
// // Fetch data from Firebase Realtime Database at a specific path
// export async function fetchRealtimeData(path) {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         if (snapshot.exists()) {
//             const data = snapshot.val();
//             console.log("Fetched Realtime Database data:", data);
//
//             // Push the fetched data into the queue
//             dataQueue.push(data);
//
//             return data;
//         } else {
//             console.log("No data available in Realtime Database at", path);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// }
//
// // Optional: Export the queue to access it outside this module
// // export { dataQueue };
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { ref, get, child } from "firebase/database";
// import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
//
// const dataQueue = [];
//
// export async function fetchCollectionData() {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//
//         dataQueue.push(...musicData);
//         return dataQueue; // Return dataQueue for ease of use in List component
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// }
//
// export async function fetchDocumentData(docId) {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             const data = { id: docSnapshot.id, ...docSnapshot.data() };
//             console.log("Fetched document data:", data);
//
//             dataQueue.push(data);
//             return data;
//         } else {
//             console.log("No such document in Firestore");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// }
//
// export async function fetchRealtimeData(path) {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         if (snapshot.exists()) {
//             const data = snapshot.val();
//             console.log("Fetched Realtime Database data:", data);
//
//             dataQueue.push(data);
//             return data;
//         } else {
//             console.log("No data available in Realtime Database at", path);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// }
//
// export { dataQueue };
