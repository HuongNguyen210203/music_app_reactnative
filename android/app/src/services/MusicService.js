
import {
    collection, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove
} from "firebase/firestore";
import { ref, get, child } from "firebase/database";
import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
import Sound from 'react-native-sound';
import { getAuth } from "firebase/auth";


let sound = null;
let dataQueue = [];
let currentSongIndex = 0;
let currentSongUrl = '';
let lastPosition = 0;

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

export const play = async (audioUrl) => {
    if (!audioUrl) return;

    if (!await isValidAudioUrl(audioUrl)) return;

    if (sound && currentSongUrl === audioUrl) {
        sound.play();
        sound.setCurrentTime(lastPosition);
    } else {
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
        lastPosition = 0;
        currentSongUrl = '';
    }
};


export const toggleLikeSong = async (songId, navigation) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !songId) {
        console.error("User not logged in or no song ID provided.");
        return;
    }

    const userId = currentUser.uid;
    console.log("Authenticated user ID:", userId);

    try {

        const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", userId);
        const docSnapshot = await getDoc(favoriteSongDocRef);


        if (!docSnapshot.exists()) {
            console.log("No Favorite-Song document found. Creating a new one for user:", userId);
            await setDoc(favoriteSongDocRef, {
                songs: []
            });
            console.log("Document created for user:", userId);
        } else {
            console.log("Favorite-Song document exists for user:", userId);
        }


        const updatedDocSnapshot = await getDoc(favoriteSongDocRef);
        const songs = updatedDocSnapshot.data().songs || [];


        const songAlreadyLiked = songs.some(song => song.songId === songId);

        if (songAlreadyLiked) {
            console.log("Song already liked. Removing from liked songs.");

            await updateDoc(favoriteSongDocRef, {
                songs: songs.filter(song => song.songId !== songId)
            });
        } else {
            console.log("Song not liked. Adding to liked songs.");

            const songDocRef = doc(FIREBASE_DB, "music", songId);
            const songDocSnapshot = await getDoc(songDocRef);
            if (!songDocSnapshot.exists()) {
                console.error(`Song with ID ${songId} does not exist.`);
                return;
            }


            const songData = songDocSnapshot.data();
            const { title = "Unknown Title", imageUrl = null } = songData;

            // Add song to the songs array in the user's Favorite-Song document
            await updateDoc(favoriteSongDocRef, {
                songs: arrayUnion({ songId, title, imageUrl })
            });

            console.log("Song added to liked songs.");
        }

        // Navigate to MusicPlayer (for example)
        navigation.navigate('MusicPlayer', {
            songId,
            liked: !songAlreadyLiked,  // Indicating the song's like status
        });

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

    shuffleQueue();  // Shuffle the queue first
    currentSongIndex = (currentSongIndex + 1) % dataQueue.length;  // Update the current song index
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
        stop();
        await play(previousSong.mp3);

        return previousSong;
    }
    return null;
};

export const shuffleQueue = () => {
    for (let i = dataQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dataQueue[i], dataQueue[j]] = [dataQueue[j], dataQueue[i]];
    }
    currentSongIndex = 0;
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
    lastPosition = position;
};


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


export const likeCurrentSong = async (userId, song) => {
    try {
        if (!userId || !song || !song.id) return;

        const docRef = doc(FIREBASE_DB, "Favorite-Song", userId);
        const docSnap = await getDoc(docRef);

        let userFavorites = [];
        if (docSnap.exists()) {
            userFavorites = docSnap.data().songs || [];
        }


        const isAlreadyLiked = userFavorites.some(favSong => favSong.id === song.id);

        if (isAlreadyLiked) {
            console.log("Song already liked.");
            return;
        }


        await updateDoc(docRef, {
            songs: arrayUnion(song)
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
        return false;
    }

    try {

        const favoriteSongDocRef = doc(FIREBASE_DB, "Favorite-Song", uid);
        const docSnapshot = await getDoc(favoriteSongDocRef);

        if (docSnapshot.exists()) {

            const likedSongs = docSnapshot.data().likedSongs || [];


            const isLiked = likedSongs.some(song => song.songId === songId);

            if (isLiked) {
                return true;
            } else {

                await updateDoc(favoriteSongDocRef, {
                    likedSongs: arrayUnion({ songId, ...songDetails })
                });
                return true;
            }
        } else {
            await updateDoc(favoriteSongDocRef, {
                likedSongs: arrayUnion({ songId, ...songDetails })
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
    checkIfLiked,
    setQueue,
    shuffleQueue,
    getQueue,
};


