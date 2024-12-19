
import {
    collection, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove
} from "firebase/firestore";
import { ref, get, child } from "firebase/database";
import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
import Sound from 'react-native-sound';

let sound = null;
let dataQueue = []; // Store data locally in the service
let currentSongIndex = -1; // Track the index of the currently playing song
let currentSongUrl = '';
let lastPosition = 0; // Track the last position of the paused song

export const getSoundInstance = () => sound;

const isValidAudioUrl = async (url, retries = 3) => {
    try {
        if (!url) return false;
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        if (retries > 0) {
            return await isValidAudioUrl(url, retries - 1);
        } else {
            return false;
        }
    }
};

// Function to check if the pressed song is the same as the current song
export const play = async (audioUrl) => {
    if (!audioUrl) return;

    if (!await isValidAudioUrl(audioUrl)) return;

    // Check if the selected song is the same as the current song
    if (sound && currentSongUrl === audioUrl) {
        // If it is the same, resume from the last position
        sound.play();
        sound.setCurrentTime(lastPosition);
    } else {
        // If it's a different song, stop the current song and start the new one
        if (sound) {
            sound.stop();
            sound.release();
        }

        sound = new Sound(audioUrl, '', (error) => {
            if (error) return;
            sound.play();
        });

        currentSongUrl = audioUrl;
        lastPosition = 0; // Reset the position when switching to a new song
    }
};

export const pause = () => {
    if (sound) {
        sound.pause();
        sound.getCurrentTime((seconds) => {
            lastPosition = seconds;
        });
    }
};

export const stop = () => {
    if (sound) {
        sound.stop();
        sound.release();
        lastPosition = 0; // Reset the position
        currentSongUrl = ''; // Reset the current song URL
    }
};


//toggle like song
export const toggleLikeSong = async (songId, navigation) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !songId) {
        console.error("User not logged in or no song ID provided.");
        return;
    }

    try {
        // Reference to the user's "Favorite-Song" document
        const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", currentUser.uid);
        const docSnapshot = await getDoc(favoriteSongDocRef);

        // If the document doesn't exist, create it with an empty likedSongs array
        if (!docSnapshot.exists()) {
            console.log("No Favorite-Song document found. Creating a new one.");
            await setDoc(favoriteSongDocRef, {
                likedSongs: []  // Initialize with an empty likedSongs array
            });
        }

        // Fetch the current liked songs from the document
        const updatedDocSnapshot = await getDoc(favoriteSongDocRef);
        const likedSongs = updatedDocSnapshot.data().likedSongs || [];

        // Check if the song is already liked
        const songAlreadyLiked = likedSongs.some(song => song.songId === songId);

        if (songAlreadyLiked) {
            // If the song is liked, navigate to the MusicPlayer with the liked status as true
            console.log("Song already liked. Navigating to MusicPlayer with liked=true...");

            navigation.navigate('MusicPlayer', {
                songId,
                liked: true,  // Full heart, song is liked
            });
        } else {
            // If the song is not liked, navigate with liked status as false and add it to liked songs
            console.log("Song not liked. Navigating to MusicPlayer with liked=false...");

            navigation.navigate('MusicPlayer', {
                songId,
                liked: false,  // Empty heart, song is not liked
            });

            // Fetch song data from "music" collection
            const songDocRef = doc(FIREBASE_DB, "music", songId);
            const songDocSnapshot = await getDoc(songDocRef);
            if (!songDocSnapshot.exists()) {
                console.error(`Song with ID ${songId} does not exist.`);
                return;
            }

            // Get song data
            const songData = songDocSnapshot.data();
            const { title = "Unknown Title", imageUrl = null } = songData;

            // Add song to the liked songs array in the user's Favorite-Song document
            await updateDoc(favoriteSongDocRef, {
                likedSongs: arrayUnion({ songId, title, imageUrl })
            });

            // Optionally, update the heart icon in the UI
            console.log("Song added to liked songs.");
        }
    } catch (error) {
        console.error("Error checking or updating liked status:", error);
    }
};


export const setQueue = (songs) => {
    dataQueue = songs;
};

export const getQueue = () => {
    return dataQueue;
};

export const fetchCollectionData = async () => {
    try {
        const musicCollection = collection(FIREBASE_DB, "music");
        const querySnapshot = await getDocs(musicCollection);
        const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQueue(musicData);
        return musicData;
    } catch (error) {
        console.error("Error fetching collection data:", error);
    }
};

export const fetchDocumentData = async (docId) => {
    try {
        const musicDoc = doc(FIREBASE_DB, "music", docId);
        const docSnapshot = await getDoc(musicDoc);
        if (docSnapshot.exists()) {
            const data = { id: docSnapshot.id, ...docSnapshot.data() };
            dataQueue.push(data);
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching document data:", error);
    }
};

export const fetchRealtimeData = async (path) => {
    try {
        const dbRef = ref(FIREBASE_DATABASE);
        const snapshot = await get(child(dbRef, path));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error fetching Realtime Database data:", error);
    }
};

export const playNext = async () => {
    if (dataQueue.length === 0) return null;

    currentSongIndex = (currentSongIndex + 1) % dataQueue.length;
    const nextSong = dataQueue[currentSongIndex];

    if (nextSong && nextSong.mp3) {
        stop();  // Stop the current song
        await play(nextSong.mp3);  // Play the next song

        return nextSong;  // Return song details without liking it
    }
    return null;
};

export const playPrevious = async () => {
    if (dataQueue.length === 0) return null;

    currentSongIndex = (currentSongIndex - 1 + dataQueue.length) % dataQueue.length;
    const previousSong = dataQueue[currentSongIndex];

    if (previousSong && previousSong.mp3) {
        stop();  // Stop the current song
        await play(previousSong.mp3);  // Play the previous song

        return previousSong;  // Return song details without liking it
    }
    return null;
};


export const getCurrentPosition = () => {
    return new Promise((resolve) => {
        if (sound) {
            sound.getCurrentTime((seconds) => resolve(seconds));
        } else {
            resolve(0);
        }
    });
};

export const getDuration = () => {
    return sound ? sound.getDuration() : 0;
};

export const startPositionTracking = (onUpdate) => {
    if (!sound) return;

    const interval = setInterval(async () => {
        if (sound) {
            const position = await getCurrentPosition();
            const duration = getDuration();
            onUpdate(position, duration);
        }
    }, 1000);

    return () => clearInterval(interval);
};

export const seekTo = (position) => {
    if (sound) sound.setCurrentTime(position);
    lastPosition = position; // update the last position manually when seeking
};

//get the details of the song
export const getSongDetails = async (songId, uid) => {
    if (!songId) {
        console.error("Song ID is required to fetch song details.");
        return null;
    }

    try {
        const songDocRef = doc(FIREBASE_DB, "music", songId);
        const songDoc = await getDoc(songDocRef);

        if (!songDoc.exists()) {
            console.error(`Song with ID ${songId} not found.`);
            return null;
        }

        const songData = songDoc.data();
        const songDetails = {
            songId: songDoc.id,
            title: songData.title || "Unknown Title",
            imageUrl: songData.imageUrl || null,
        };

        // Check if the song is liked by the current user
        const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", uid);
        const docSnapshot = await getDoc(favoriteSongDocRef);

        if (docSnapshot.exists()) {
            const likedSongs = docSnapshot.data().likedSongs || [];
            const songAlreadyLiked = likedSongs.some(song => song.songId === songId);
            songDetails.isLiked = songAlreadyLiked;
        } else {
            songDetails.isLiked = false;
        }

        return songDetails;
    } catch (error) {
        console.error("Error fetching song details:", error);
        return null;
    }
};

export const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'; // Handle edge cases
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Function to handle liking the current song (does not remove)
export const likeCurrentSong = async (userId, song) => {
    try {
        if (!userId || !song || !song.id) return;

        const docRef = doc(FIREBASE_DB, "Favorite-Song", userId);
        const docSnap = await getDoc(docRef);

        let userFavorites = [];
        if (docSnap.exists()) {
            userFavorites = docSnap.data().songs || [];
        }

        // Check if the song is already liked
        const isAlreadyLiked = userFavorites.some(favSong => favSong.id === song.id);

        if (isAlreadyLiked) {
            console.log("Song already liked.");
            return;
        }

        // Add the song to the user's favorites
        await updateDoc(docRef, {
            songs: arrayUnion(song)  // Add the song object to the list
        });

        console.log("Song liked successfully!");
    } catch (error) {
        console.error("Error liking the song:", error);
    }
};


export const checkIfLiked = async (songId, userId) => {
    try {
        if (!songId || !userId) {
            console.error("Missing songId or userId.");
            return false;
        }

        const docRef = doc(FIREBASE_DB, "Favorite-Song", userId);
        const docSnap = await getDoc(docRef);

        // If the document doesn't exist, the song is definitely not liked
        if (!docSnap.exists()) {
            console.log(`No Favorite-Song document found for user ${userId}.`);
            return false;
        }

        const userFavorites = docSnap.data().songs || [];
        console.log("User Favorites:", userFavorites);

        // Check if the song ID exists in the favorites list
        const isLiked = userFavorites.some(song => song.id === songId);
        console.log(`Song ID ${songId} liked:`, isLiked);

        return isLiked;
    } catch (error) {
        console.error("Error checking liked status:", error);
        return false;
    }
};



export const checkSongLikedStatus = async (uid, songId, songDetails) => {
    if (!uid || !songId) {
        console.error("User UID and song ID are required to check liked status.");
        return false; // Default to false if missing required info
    }

    try {
        // Reference to the user's liked songs in the "Favorite-Song" collection
        const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", uid);
        const docSnapshot = await getDoc(favoriteSongDocRef);

        if (docSnapshot.exists()) {
            // Get the array of liked songs
            const likedSongs = docSnapshot.data().likedSongs || [];

            // Check if the song is already liked
            const isLiked = likedSongs.some(song => song.songId === songId);

            if (isLiked) {
                return true; // Song is already liked
            } else {
                // If song is not liked, add it to the liked songs array
                await updateDoc(favoriteSongDocRef, {
                    likedSongs: arrayUnion({ songId, ...songDetails }) // Add the song to the liked songs array
                });
                return true; // Return true after adding
            }
        } else {
            // If the document does not exist, create it with the song liked
            await updateDoc(favoriteSongDocRef, {
                likedSongs: arrayUnion({ songId, ...songDetails }) // Create new liked songs array
            });
            return true;
        }
    } catch (error) {
        console.error("Error checking or updating liked status:", error);
        return false;
    }
};



export default {
    getSoundInstance,
    getCurrentPosition,
    seekTo,
    getDuration,
    startPositionTracking,
    play,
    pause,
    stop,
    fetchCollectionData,
    fetchDocumentData,
    fetchRealtimeData,
    playNext,
    playPrevious,
    likeCurrentSong,
    getSongDetails,
    formatTime,
    checkSongLikedStatus,
    toggleLikeSong,
    checkIfLiked
};


// import {arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc} from "firebase/firestore";
// import {child, get, ref} from "firebase/database";
// import {FIREBASE_DATABASE, FIREBASE_DB} from "../../../FirebaseConfig";
// import Sound from 'react-native-sound';
//
// let sound = null;
// let dataQueue = []; // Store data locally in the service
// let currentSongIndex = -1; // Track the index of the currently playing song
// let currentSongUrl = '';
// let lastPosition = 0; // Track the last position of the paused song
//
// export const getSoundInstance = () => sound;
//
// const isValidAudioUrl = async (url, retries = 3) => {
//     try {
//         if (!url) return false;
//         const response = await fetch(url, { method: 'HEAD' });
//         return response.ok;
//     } catch (error) {
//         if (retries > 0) {
//             return await isValidAudioUrl(url, retries - 1);
//         } else {
//             return false;
//         }
//     }
// };
//
// // Function to check if the pressed song is the same as the current song
// export const play = async (audioUrl) => {
//     if (!audioUrl) return;
//
//     if (!await isValidAudioUrl(audioUrl)) return;
//
//     // Check if the selected song is the same as the current song
//     if (sound && currentSongUrl === audioUrl) {
//         // If it is the same, resume from the last position
//         sound.play();
//         sound.setCurrentTime(lastPosition);
//     } else {
//         // If it's a different song, stop the current song and start the new one
//         if (sound) {
//             sound.stop();
//             sound.release();
//         }
//
//         sound = new Sound(audioUrl, '', (error) => {
//             if (error) return;
//             sound.play();
//         });
//
//         currentSongUrl = audioUrl;
//         lastPosition = 0; // Reset the position when switching to a new song
//     }
// };
//
// export const pause = () => {
//     if (sound) {
//         sound.pause();
//         sound.getCurrentTime((seconds) => {
//             lastPosition = seconds;
//         });
//     }
// };
//
// export const stop = () => {
//     if (sound) {
//         sound.stop();
//         sound.release();
//         lastPosition = 0; // Reset the position
//         currentSongUrl = ''; // Reset the current song URL
//     }
// };
//
// // export const play = async (audioUrl) => {
// //     if (!audioUrl) return;
// //
// //     if (!await isValidAudioUrl(audioUrl)) return;
// //
// //     if (sound && currentSongUrl === audioUrl) {
// //         sound.play();
// //         sound.setCurrentTime(lastPosition);
// //     } else {
// //         if (sound) {
// //             sound.stop();
// //             sound.release();
// //         }
// //
// //         sound = new Sound(audioUrl, '', (error) => {
// //             if (error) return;
// //             sound.play();
// //         });
// //
// //         currentSongUrl = audioUrl;
// //         lastPosition = 0; // reset the position
// //     }
// // };
// //
// // export const pause = () => {
// //     if (sound) {
// //         sound.pause();
// //         sound.getCurrentTime((seconds) => {
// //             lastPosition = seconds;
// //         });
// //     }
// // };
// //
// // export const stop = () => {
// //     if (sound) {
// //         sound.stop();
// //         sound.release();
// //         lastPosition = 0; // reset the position
// //         currentSongUrl = ''; // reset the current song URL
// //     }
// // };
//
// export const setQueue = (songs) => {
//     dataQueue = songs;
// };
//
// export const getQueue = () => {
//     return dataQueue;
// };
//
// export const fetchCollectionData = async () => {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setQueue(musicData);
//         return musicData;
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// };
//
// export const fetchDocumentData = async (docId) => {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             const data = { id: docSnapshot.id, ...docSnapshot.data() };
//             dataQueue.push(data);
//             return data;
//         }
//         return null;
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// };
//
// export const fetchRealtimeData = async (path) => {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         return snapshot.exists() ? snapshot.val() : null;
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// };
//
// export const playNext = async (uid) => {
//     if (dataQueue.length === 0) return;
//
//     currentSongIndex = (currentSongIndex + 1) % dataQueue.length;
//     const nextSong = dataQueue[currentSongIndex];
//
//     if (nextSong && nextSong.mp3) {
//         stop();  // Stop the current song
//         await play(nextSong.mp3);  // Play the next song
//
//         // Wait for the song to be playing before calling like function
//         if (uid && nextSong.id) {
//             await likeCurrentSong(uid, nextSong.id);  // Call like function after song starts playing
//         }
//
//         return nextSong;
//     }
// };
//
// export const playPrevious = async (uid) => {
//     if (dataQueue.length === 0) return;
//
//     currentSongIndex = (currentSongIndex - 1 + dataQueue.length) % dataQueue.length;
//     const previousSong = dataQueue[currentSongIndex];
//
//     if (previousSong && previousSong.mp3) {
//         stop();  // Stop the current song
//         await play(previousSong.mp3);  // Play the previous song
//
//         // Wait for the song to be playing before calling like function
//         if (uid && previousSong.id) {
//             await likeCurrentSong(uid, previousSong.id);  // Call like function after song starts playing
//         }
//
//         return previousSong;
//     }
// };
//
//
// export const getCurrentPosition = () => {
//     return new Promise((resolve) => {
//         if (sound) {
//             sound.getCurrentTime((seconds) => resolve(seconds));
//         } else {
//             resolve(0);
//         }
//     });
// };
//
// export const getDuration = () => {
//     return sound ? sound.getDuration() : 0;
// };
//
// export const startPositionTracking = (onUpdate) => {
//     if (!sound) return;
//
//     const interval = setInterval(async () => {
//         if (sound) {
//             const position = await getCurrentPosition();
//             const duration = getDuration();
//             onUpdate(position, duration);
//         }
//     }, 1000);
//
//     return () => clearInterval(interval);
// };
//
// export const seekTo = (position) => {
//     if (sound) sound.setCurrentTime(position);
//     lastPosition = position; // update the last position manually when seeking
// };
//
//
//
// export const likeCurrentSong = async (uid, id) => {
//     if (!uid || !id) {
//         console.error("User UID and song ID are required to like a song.");
//         return;
//     }
//
//     try {
//         console.log("Liking song with ID:", id);
//         const songDocRef = doc(FIREBASE_DB, "music", id);
//         const songDoc = await getDoc(songDocRef);
//
//         if (!songDoc.exists()) {
//             console.error(`Song with ID ${id} not found.`);
//             return;
//         }
//
//         const songData = songDoc.data();
//         const { title = "Unknown Title", imageUrl = null } = songData;
//         const fetchedSongId = songDoc.id;
//
//         const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", uid);
//         const docSnapshot = await getDoc(favoriteSongDocRef);
//
//         if (docSnapshot.exists()) {
//             // Check if the song is already liked
//             const likedSongs = docSnapshot.data().likedSongs || [];
//             const songAlreadyLiked = likedSongs.some(song => song.songId === id);
//             if (!songAlreadyLiked) {
//                 await updateDoc(favoriteSongDocRef, {
//                     likedSongs: arrayUnion({ songId: id, title, imageUrl })
//                 });
//             }
//         } else {
//             await setDoc(favoriteSongDocRef, {
//                 likedSongs: [{ songId: fetchedSongId, title, imageUrl }]
//             });
//         }
//
//         console.log("Song liked successfully!");
//     } catch (error) {
//         console.error("Error liking the song:", error);
//     }
// };
//
// export const getSongDetails = async (songId, uid) => {
//     if (!songId) {
//         console.error("Song ID is required to fetch song details.");
//         return null;
//     }
//
//     try {
//         const songDocRef = doc(FIREBASE_DB, "music", songId);
//         const songDoc = await getDoc(songDocRef);
//
//         if (!songDoc.exists()) {
//             console.error(`Song with ID ${songId} not found.`);
//             return null;
//         }
//
//         const songData = songDoc.data();
//         const songDetails = {
//             songId: songDoc.id,
//             title: songData.title || "Unknown Title",
//             imageUrl: songData.imageUrl || null,
//         };
//
//         // Check if the song is liked by the current user
//         const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", uid);
//         const docSnapshot = await getDoc(favoriteSongDocRef);
//
//         if (docSnapshot.exists()) {
//             const likedSongs = docSnapshot.data().likedSongs || [];
//             songDetails.isLiked = likedSongs.some(song => song.songId === songId);
//         } else {
//             songDetails.isLiked = false;
//         }
//
//         return songDetails;
//     } catch (error) {
//         console.error("Error fetching song details:", error);
//         return null;
//     }
// };
//
// export const formatTime = (seconds) => {
//     if (!seconds || isNaN(seconds)) return '0:00'; // Handle edge cases
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
// };
// // export const checkSongLikedStatus = async (uid, songId) => {
// //     if (!uid || !songId) {
// //         console.error("User UID and song ID are required to check liked status.");
// //         return false; // Default to false if missing required info
// //     }
// //
// //     try {
// //         // Reference to the user's liked songs in the "Favorite-Song" collection
// //         const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", uid);
// //         const docSnapshot = await getDoc(favoriteSongDocRef);
// //
// //         if (docSnapshot.exists()) {
// //             // Get the array of liked songs
// //             const likedSongs = docSnapshot.data().likedSongs || [];
// //             // Check if the song is in the liked songs array
// //             return likedSongs.some(song => song.songId === songId);
// //         } else {
// //             // If the document does not exist, the user hasn't liked any songs
// //             return false;
// //         }
// //     } catch (error) {
// //         console.error("Error checking liked status:", error);
// //         return false;
// //     }
// // };
//
//
// export const checkSongLikedStatus = async (uid, songId, songDetails) => {
//     if (!uid || !songId) {
//         console.error("User UID and song ID are required to check liked status.");
//         return false; // Default to false if missing required info
//     }
//
//     try {
//         // Reference to the user's liked songs in the "Favorite-Song" collection
//         const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", uid);
//         const docSnapshot = await getDoc(favoriteSongDocRef);
//
//         if (docSnapshot.exists()) {
//             // Get the array of liked songs
//             const likedSongs = docSnapshot.data().likedSongs || [];
//
//             // Check if the song is already liked
//             const isLiked = likedSongs.some(song => song.songId === songId);
//
//             if (isLiked) {
//                 return true; // Song is already liked
//             } else {
//                 // If song is not liked, add it to the liked songs array
//                 await updateDoc(favoriteSongDocRef, {
//                     likedSongs: arrayUnion({ songId, ...songDetails }) // Add the song to the liked songs array
//                 });
//                 return true; // Return true after adding
//             }
//         } else {
//             // If the document does not exist, create it with the song liked
//             await updateDoc(favoriteSongDocRef, {
//                 likedSongs: arrayUnion({ songId, ...songDetails }) // Create new liked songs array
//             });
//             return true;
//         }
//     } catch (error) {
//         console.error("Error checking or updating liked status:", error);
//         return false;
//     }
// };
//
//
// export default {
//     getSoundInstance,
//     getCurrentPosition,
//     seekTo,
//     getDuration,
//     startPositionTracking,
//     play,
//     pause,
//     stop,
//     fetchCollectionData,
//     fetchDocumentData,
//     fetchRealtimeData,
//     playNext,
//     playPrevious,
//     likeCurrentSong,
//     getSongDetails,
//     formatTime,
//     checkSongLikedStatus,
// };