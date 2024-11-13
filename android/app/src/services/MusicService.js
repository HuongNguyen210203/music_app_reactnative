// // import Sound from 'react-native-sound';
// //
// // class MusicService {
// //     constructor() {
// //         this.sound = null;
// //         this.isPlaying = false;
// //         this.queue = [];
// //         this.currentTrackIndex = 0;
// //         this.volume = 1.0; // Volume level between 0.0 and 1.0
// //         this.onPlaybackComplete = null;
// //     }
// //
// //     initializeQueue(songs) {
// //         // Initialize the queue with songs
// //         this.queue = songs.map(song => ({
// //             url: song.url,
// //             title: song.title,
// //             art: song.art // URL or path to the album art
// //         }));
// //         this.currentTrackIndex = 0;
// //         console.log('Queue initialized with songs:', this.queue);
// //     }
// //
// //     async load(audioUrl) {
// //         return new Promise((resolve, reject) => {
// //             this.release(); // Release any previous instance
// //             this.sound = new Sound(audioUrl, null, (error) => {
// //                 if (error) {
// //                     console.log('Failed to load sound', error);
// //                     reject(error);
// //                     return;
// //                 }
// //                 this.sound.setVolume(this.volume);
// //                 resolve(this.sound.getDuration());
// //             });
// //         });
// //     }
// //
// //     play(onComplete) {
// //         if (this.sound) {
// //             this.sound.play((success) => {
// //                 if (success) {
// //                     console.log('Finished playing');
// //                     if (onComplete) {
// //                         onComplete();
// //                     }
// //                 } else {
// //                     console.log('Playback failed');
// //                 }
// //             });
// //             this.isPlaying = true;
// //         }
// //     }
// //
// //     pause() {
// //         if (this.sound) {
// //             this.sound.pause();
// //             this.isPlaying = false;
// //         }
// //     }
// //
// //     stop() {
// //         if (this.sound) {
// //             this.sound.stop(() => {
// //                 console.log('Playback stopped');
// //             });
// //             this.isPlaying = false;
// //         }
// //     }
// //
// //     nextTrack() {
// //         if (this.queue.length === 0) return;
// //
// //         this.currentTrackIndex = (this.currentTrackIndex + 1) % this.queue.length;
// //         this.load(this.queue[this.currentTrackIndex].url);
// //     }
// //
// //     previousTrack() {
// //         if (this.queue.length === 0) return;
// //
// //         this.currentTrackIndex = (this.currentTrackIndex - 1 + this.queue.length) % this.queue.length;
// //         this.load(this.queue[this.currentTrackIndex].url);
// //     }
// //
// //     release() {
// //         if (this.sound) {
// //             this.sound.release();
// //             this.sound = null;
// //             this.isPlaying = false;
// //         }
// //     }
// //
// //     seekTo(seconds) {
// //         if (this.sound) {
// //             this.sound.setCurrentTime(seconds);
// //         }
// //     }
// //
// //     setVolume(value) {
// //         this.volume = value;
// //         if (this.sound) {
// //             this.sound.setVolume(value);
// //         }
// //     }
// //
// //     getCurrentTrackInfo() {
// //         return this.queue[this.currentTrackIndex] || null;
// //     }
// //
// //     getCurrentTime(callback) {
// //         if (this.sound) {
// //             this.sound.getCurrentTime((seconds) => {
// //                 if (callback) {
// //                     callback(seconds);
// //                 }
// //             });
// //         }
// //     }
// // }
// //
// // export default new MusicService();
// //
// // import Sound from 'react-native-sound';
// //
// // class MusicService {
// //     constructor() {
// //         this.sound = null;
// //         this.isPlaying = false;
// //         this.queue = [];
// //         this.currentTrackIndex = 0;
// //         this.volume = 1.0; // Volume level between 0.0 and 1.0
// //         this.onPlaybackComplete = null;
// //     }
// //
// //     initializeQueue(songs) {
// //         // Initialize the queue with songs
// //         this.queue = songs.map(song => ({
// //             url: song.url,
// //             title: song.title,
// //             art: song.art // URL or path to the album art
// //         }));
// //         this.currentTrackIndex = 0;
// //         console.log('Queue initialized with songs:', this.queue);
// //     }
// //
// //     async load(audioUrl) {
// //         return new Promise((resolve, reject) => {
// //             this.release(); // Release any previous instance
// //             this.sound = new Sound(audioUrl, null, (error) => {
// //                 if (error) {
// //                     console.log('Failed to load sound', error);
// //                     reject(error);
// //                     return;
// //                 }
// //
// //                 this.sound.setVolume(this.volume);
// //                 resolve(this.sound.getDuration());
// //             });
// //         });
// //     }
// //
// //     play(onComplete) {
// //         if (this.sound) {
// //             this.sound.play((success) => {
// //                 if (success) {
// //                     console.log('Finished playing');
// //                     if (onComplete) {
// //                         onComplete();
// //                     }
// //                     this.nextTrack(); // Automatically play the next track
// //                 } else {
// //                     console.log('Playback failed');
// //                 }
// //             });
// //             this.isPlaying = true;
// //         }
// //     }
// //
// //     pause() {
// //         if (this.sound) {
// //             this.sound.pause();
// //             this.isPlaying = false;
// //         }
// //     }
// //
// //     stop() {
// //         if (this.sound) {
// //             this.sound.stop(() => {
// //                 console.log('Playback stopped');
// //             });
// //             this.isPlaying = false;
// //         }
// //     }
// //
// //     nextTrack() {
// //         if (this.queue.length === 0) return;
// //
// //         this.currentTrackIndex = (this.currentTrackIndex + 1) % this.queue.length;
// //         this.load(this.queue[this.currentTrackIndex].url);
// //     }
// //
// //     previousTrack() {
// //         if (this.queue.length === 0) return;
// //
// //         this.currentTrackIndex = (this.currentTrackIndex - 1 + this.queue.length) % this.queue.length;
// //         this.load(this.queue[this.currentTrackIndex].url);
// //     }
// //
// //     release() {
// //         if (this.sound) {
// //             this.sound.release();
// //             this.sound = null;
// //             this.isPlaying = false;
// //         }
// //     }
// //
// //     seekTo(seconds) {
// //         if (this.sound) {
// //             this.sound.setCurrentTime(seconds);
// //         }
// //     }
// //
// //     setVolume(value) {
// //         this.volume = value;
// //         if (this.sound) {
// //             this.sound.setVolume(value);
// //         }
// //     }
// //
// //     getCurrentTrackInfo() {
// //         return this.queue[this.currentTrackIndex] || null;
// //     }
// //
// //     getCurrentTime(callback) {
// //         if (this.sound) {
// //             this.sound.getCurrentTime((seconds) => {
// //                 if (callback) {
// //                     callback(seconds);
// //                 }
// //             });
// //         }
// //     }
// // }
// //
// // export default new MusicService();
//
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import MusicService from '../services/MusicService';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Slider from '@react-native-community/slider';
//
// const MusicPlayer = ({ route }) => {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [currentPosition, setCurrentPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const intervalRef = useRef(null);
//
//     const { title, audioUrl, imageUrl, artist } = route.params;
//
//     useEffect(() => {
//         const loadTrack = async () => {
//             setIsPlaying(true);
//             setCurrentPosition(0);
//
//             const audioDuration = await MusicService.load(audioUrl);
//             setDuration(audioDuration);
//
//             MusicService.play();
//             intervalRef.current = setInterval(() => {
//                 MusicService.getCurrentTime((seconds) => setCurrentPosition(seconds));
//             }, 1000);
//         };
//
//         loadTrack();
//
//         return () => {
//             clearInterval(intervalRef.current);
//             MusicService.stop();
//         };
//     }, [audioUrl]);
//
//     const handlePlayPause = () => {
//         if (isPlaying) {
//             MusicService.pause();
//         } else {
//             MusicService.play();
//         }
//         setIsPlaying(!isPlaying);
//     };
//
//     const handleNextTrack = () => {
//         MusicService.nextTrack();
//         setIsPlaying(true); // Automatically play the next track
//     };
//
//     const handlePreviousTrack = () => {
//         MusicService.previousTrack();
//         setIsPlaying(true); // Automatically play the previous track
//     };
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>{title}</Text>
//             <Text style={styles.artist}>{artist}</Text>
//             {imageUrl && <Image source={{ uri: imageUrl }} style={styles.trackImage} />}
//
//             <Slider
//                 style={styles.progressSlider}
//                 minimumValue={0}
//                 maximumValue={duration}
//                 value={currentPosition}
//                 onSlidingComplete={(value) => MusicService.seekTo(value)}
//                 minimumTrackTintColor="#FFA500"
//                 maximumTrackTintColor="#ccc"
//                 thumbTintColor="#FFA500"
//             />
//
//             <View style={styles.controlButtons}>
//                 <TouchableOpacity onPress={handlePreviousTrack} style={styles.controlButton}>
//                     <Icon name="backward" size={30} color="#FFA500" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
//                     <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleNextTrack} style={styles.controlButton}>
//                     <Icon name="forward" size={30} color="#FFA500" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#121212',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     title: {
//         fontSize: 24,
//         color: '#FFA500',
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     artist: {
//         fontSize: 18,
//         color: '#BBB',
//         marginBottom: 20,
//     },
//     trackImage: {
//         width: 200,
//         height: 200,
//         borderRadius: 10,
//         marginBottom: 20,
//     },
//     progressSlider: {
//         width: '90%',
//         height: 40,
//     },
//     controlButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         width: '60%',
//         marginTop: 20,
//     },
//     controlButton: {
//         padding: 10,
//     },
// });
//
// export default MusicPlayer;
//
// import Sound from 'react-native-sound';
//
// class MusicService {
//     constructor() {
//         this.sound = null;
//         this.isPlaying = false;
//         this.queue = [];
//         this.currentTrackIndex = 0;
//         this.volume = 1.0; // Volume level between 0.0 and 1.0
//         this.onPlaybackComplete = null;
//     }
//
//     initializeQueue(songs) {
//         this.queue = songs.map(song => ({
//             url: song.url,
//             title: song.title,
//             art: song.art // URL or path to the album art
//         }));
//         this.currentTrackIndex = 0;
//         console.log('Queue initialized with songs:', this.queue);
//     }
//
//     async load(audioUrl) {
//         return new Promise((resolve, reject) => {
//             this.release(); // Release any previous instance
//             this.sound = new Sound(audioUrl, null, (error) => {
//                 if (error) {
//                     console.log('Failed to load sound', error);
//                     reject(error);
//                     return;
//                 }
//
//                 this.sound.setVolume(this.volume);
//                 resolve(this.sound.getDuration());
//             });
//         });
//     }
//
//     play(onComplete) {
//         if (this.sound) {
//             this.sound.play((success) => {
//                 if (success) {
//                     console.log('Finished playing');
//                     if (onComplete) {
//                         onComplete();
//                     }
//                     this.nextTrack();
//                 } else {
//                     console.log('Playback failed');
//                 }
//             });
//             this.isPlaying = true;
//         }
//     }
//
//     pause() {
//         if (this.sound) {
//             this.sound.pause();
//             this.isPlaying = false;
//         }
//     }
//
//     stop() {
//         if (this.sound) {
//             this.sound.stop(() => {
//                 console.log('Playback stopped');
//             });
//             this.isPlaying = false;
//         }
//     }
//
//     nextTrack() {
//         if (this.queue.length === 0) return;
//
//         this.currentTrackIndex = (this.currentTrackIndex + 1) % this.queue.length;
//         this.load(this.queue[this.currentTrackIndex].url).then(() => this.play());
//     }
//
//     previousTrack() {
//         if (this.queue.length === 0) return;
//
//         this.currentTrackIndex = (this.currentTrackIndex - 1 + this.queue.length) % this.queue.length;
//         this.load(this.queue[this.currentTrackIndex].url).then(() => this.play());
//     }
//
//     release() {
//         if (this.sound) {
//             this.sound.release();
//             this.sound = null;
//             this.isPlaying = false;
//         }
//     }
//
//     seekTo(seconds) {
//         if (this.sound) {
//             this.sound.setCurrentTime(seconds);
//         }
//     }
//
//     setVolume(value) {
//         this.volume = value;
//         if (this.sound) {
//             this.sound.setVolume(value);
//         }
//     }
//
//     getCurrentTrackInfo() {
//         return this.queue[this.currentTrackIndex] || null;
//     }
//
//     getCurrentTime(callback) {
//         if (this.sound) {
//             this.sound.getCurrentTime((seconds) => {
//                 if (callback) {
//                     callback(seconds);
//                 }
//             });
//         }
//     }
// }
//
// export default new MusicService();
//
// import Sound from 'react-native-sound';
//
// class MusicService {
//     constructor() {
//         this.sound = null;
//         this.isPlaying = false;
//         this.queue = [];
//         this.currentTrackIndex = 0;
//         this.volume = 1.0; // Volume level between 0.0 and 1.0
//     }
//
//     // Initialize the music queue
//     initializeQueue(songs) {
//         this.queue = songs.map(song => ({
//             url: song.url,
//             title: song.title,
//             art: song.art // URL or path to the album art
//         }));
//         this.currentTrackIndex = 0;
//         console.log('Queue initialized with songs:', this.queue);
//     }
//
//     // Load the audio file and return its duration
//     async load(audioUrl) {
//         return new Promise((resolve, reject) => {
//             this.release(); // Release any previous instance
//             this.sound = new Sound(audioUrl, null, (error) => {
//                 if (error) {
//                     console.log('Failed to load sound', error);
//                     reject(error);
//                     return;
//                 }
//                 this.sound.setVolume(this.volume);
//                 resolve(this.sound.getDuration());
//             });
//         });
//     }
//
//     // Play the current track
//     play(onComplete) {
//         if (this.sound) {
//             this.sound.play((success) => {
//                 if (success) {
//                     console.log('Finished playing');
//                     if (onComplete) {
//                         onComplete();
//                     }
//                     this.nextTrack();
//                 } else {
//                     console.log('Playback failed');
//                 }
//             });
//             this.isPlaying = true;
//         }
//     }
//
//     // Pause the current track
//     pause() {
//         if (this.sound) {
//             this.sound.pause();
//             this.isPlaying = false;
//         }
//     }
//
//     // Stop the current track
//     stop() {
//         if (this.sound) {
//             this.sound.stop(() => {
//                 console.log('Playback stopped');
//             });
//             this.isPlaying = false;
//         }
//     }
//
//     // Play the next track in the queue
//     nextTrack() {
//         if (this.queue.length === 0) return;
//
//         this.currentTrackIndex = (this.currentTrackIndex + 1) % this.queue.length;
//         const nextTrack = this.queue[this.currentTrackIndex];
//         this.loadAndPlay(nextTrack.url);
//     }
//
//     // Play the previous track in the queue
//     previousTrack() {
//         if (this.queue.length === 0) return;
//
//         this.currentTrackIndex = (this.currentTrackIndex - 1 + this.queue.length) % this.queue.length;
//         const previousTrack = this.queue[this.currentTrackIndex];
//         this.loadAndPlay(previousTrack.url);
//     }
//
//     // Load a track by URL and play it
//     async loadAndPlay(url) {
//         try {
//             const duration = await this.load(url);
//             console.log('Loaded track with duration:', duration);
//             this.play();
//         } catch (error) {
//             console.error('Error loading track:', error);
//         }
//     }
//
//     // Release the sound instance to free resources
//     release() {
//         if (this.sound) {
//             this.sound.release();
//             this.sound = null;
//         }
//     }
//
//     // Seek to a specific time in the track
//     seekTo(seconds) {
//         if (this.sound) {
//             this.sound.setCurrentTime(seconds);
//         }
//     }
//
//     // Get the current playback position
//     getCurrentTime(callback) {
//         if (this.sound && this.isPlaying) {
//             this.sound.getCurrentTime(callback);
//         }
//     }
// }
//
// export default new MusicService();


// // MusicService.js
//
// import { fetchCollectionData, fetchDocumentData } from './FirebaseMusicService';
//
// class MusicService {
//     constructor() {
//         this.queue = []; // Initialize an empty queue
//         this.currentIndex = 0; // Keep track of the current song in the queue
//     }
//
//     // Initialize the queue with data from Firebase
//     async initializeQueue() {
//         try {
//             const musicData = await fetchCollectionData(); // Fetch collection data from Firebase
//             this.queue = musicData || []; // Populate the queue with data
//         } catch (error) {
//             console.error('Error initializing music queue:', error);
//         }
//     }
//
//     // Get the current queue
//     getQueue() {
//         return this.queue;
//     }
//
//     // Add a single song to the queue
//     async addSongToQueue(songId) {
//         try {
//             const song = await fetchDocumentData(songId); // Fetch specific document by ID
//             if (song) {
//                 this.queue.push(song); // Add to the queue
//             }
//         } catch (error) {
//             console.error('Error adding song to queue:', error);
//         }
//     }
//
//     // Play the next song in the queue
//     getNextSong() {
//         if (this.queue.length === 0) return null; // Return null if queue is empty
//         this.currentIndex = (this.currentIndex + 1) % this.queue.length; // Loop to start
//         return this.queue[this.currentIndex];
//     }
//
//     // Play the previous song in the queue
//     getPreviousSong() {
//         if (this.queue.length === 0) return null;
//         this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
//         return this.queue[this.currentIndex];
//     }
//
//     // Get the current song
//     getCurrentSong() {
//         if (this.queue.length === 0) return null;
//         return this.queue[this.currentIndex];
//     }
//
//     // Set the queue manually (useful for playlist updates)
//     setQueue(songs) {
//         this.queue = songs;
//         this.currentIndex = 0; // Reset the current index
//     }
//
//     // Clear the queue
//     clearQueue() {
//         this.queue = [];
//         this.currentIndex = 0;
//     }
// }
//
// // Export an instance of the MusicService
// const musicService = new MusicService();
// export default musicService;
//
// import Sound from 'react-native-sound';
// import { collection, getDocs } from "firebase/firestore";
// import { FIREBASE_DB } from "../../../FirebaseConfig";
//
// let sound = null;
// let dataQueue = []; // Store data locally in the service
//
// export const play = (audioUrl) => {
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
//
//     sound = new Sound(audioUrl, '', (error) => {
//         if (error) {
//             console.log('Error loading sound: ', error);
//             return;
//         }
//
//         sound.play((success) => {
//             if (success) {
//                 console.log('Song played successfully');
//             } else {
//                 console.log('Failed to play the song');
//             }
//         });
//     });
// };
//
// export const pause = () => {
//     if (sound) {
//         sound.pause();
//     }
// };
//
// export const stop = () => {
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
// };
//
// export const setQueue = (songs) => {
//     dataQueue = songs; // Update the queue with fetched data
// };
//
// export const getQueue = () => {
//     return dataQueue; // Return the current queue
// };
//
// // Fetch data from Firestore
// export const fetchCollectionData = async () => {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//
//         setQueue(musicData); // Set the data into the queue
//         return musicData; // Return fetched data for immediate use
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// };
//
// export default {
//     play,
//     pause,
//     stop,
//     fetchCollectionData,
//     setQueue,
//     getQueue
// };

// Import necessary Firebase functions
//
// //MusicService.js
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { ref, get, child } from "firebase/database";
// import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
// import Sound from 'react-native-sound';
//
// let sound = null;
// let dataQueue = []; // Store data locally in the service
//
// // Helper function to validate if the audio URL is accessible
// const isValidAudioUrl = async (url) => {
//     try {
//         const response = await fetch(url, { method: 'HEAD' });
//         return response.ok; // Returns true if status is 200-299
//     } catch (error) {
//         console.error('Invalid audio URL:', url, error);
//         return false;
//     }
// };
//
// // Function to play audio if the URL is valid
// // Function to play audio with added logging for better debugging
// export const play = async (audioUrl) => {
//     console.log("Attempting to play song with URL:", audioUrl); // Log the URL being played
//
//     if (!await isValidAudioUrl(audioUrl)) {
//         console.warn("Invalid audio URL for the track:", audioUrl);
//         return;
//     }
//
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
//
//     sound = new Sound(audioUrl, '', (error) => {
//         if (error) {
//             console.log('Error loading sound: ', error);
//             return;
//         }
//
//         sound.play((success) => {
//             if (success) {
//                 console.log('Song played successfully');
//             } else {
//                 console.log('Failed to play the song');
//             }
//         });
//     });
// };
//
//
// // Function to pause audio
// export const pause = () => {
//     if (sound) {
//         sound.pause();
//     }
// };
//
// // Function to stop audio
// export const stop = () => {
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
// };
//
// // Function to set the queue with fetched data
// export const setQueue = (songs) => {
//     dataQueue = songs;
// };
//
// // Function to get the current queue
// export const getQueue = () => {
//     return dataQueue;
// };
//
// // Function to fetch collection data from Firestore
// export const fetchCollectionData = async () => {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//
//         setQueue(musicData); // Set the data into the queue
//         return musicData;
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// };
//
// // Function to fetch a single document data from Firestore
// export const fetchDocumentData = async (docId) => {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             const data = { id: docSnapshot.id, ...docSnapshot.data() };
//             console.log("Fetched document data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No such document in Firestore");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// };
//
// // Function to fetch real-time data from Firebase Realtime Database
// export const fetchRealtimeData = async (path) => {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         if (snapshot.exists()) {
//             const data = snapshot.val();
//             console.log("Fetched Realtime Database data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No data available in Realtime Database at", path);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// };
//
// // Export all functions and data queue for use in other components
// export default {
//     play,
//     pause,
//     stop,
//     fetchCollectionData,
//     fetchDocumentData,
//     fetchRealtimeData,
//     setQueue,
//     getQueue
// };
//
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { ref, get, child } from "firebase/database";
// import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
// import Sound from 'react-native-sound';
//
// let sound = null;
// let dataQueue = []; // Store data locally in the service
// let currentSongIndex = -1; // Track the index of the currently playing song
//
// // Helper function to validate if the audio URL is accessible with retry mechanism
// const isValidAudioUrl = async (url, retries = 3) => {
//     try {
//         console.log('Checking URL:', url);
//         if (!url) {
//             console.warn('URL is undefined or null');
//             return false;
//         }
//         const response = await fetch(url, { method: 'HEAD' });
//         if (response.ok) {
//             console.log('URL is valid:', url);
//             return true;
//         } else {
//             console.warn('URL not valid:', url);
//             return false;
//         }
//     } catch (error) {
//         if (retries > 0) {
//             console.log('Retrying URL validation...');
//             return await isValidAudioUrl(url, retries - 1);
//         } else {
//             console.error('Failed to validate URL:', url, error);
//             return false;
//         }
//     }
// };
// //
// // // Function to play audio with added logging for better debugging
// // export const play = async (audioUrl) => {
// //     console.log("Attempting to play song with URL:", audioUrl);
// //
// //     if (!audioUrl) {
// //         console.error('No audio URL provided');
// //         return;
// //     }
// //
// //     if (!await isValidAudioUrl(audioUrl)) {
// //         console.warn("Invalid audio URL for the track:", audioUrl);
// //         return;
// //     }
// //
// //     if (sound) {
// //         sound.stop();
// //         sound.release();
// //     }
// //
// //     sound = new Sound(audioUrl, '', (error) => {
// //         if (error) {
// //             console.log('Error loading sound: ', error);
// //             return;
// //         }
// //         console.log('Sound loaded successfully');
// //         sound.play((success) => {
// //             if (success) {
// //                 console.log('Song played successfully');
// //             } else {
// //                 console.log('Failed to play the song');
// //             }
// //         });
// //     });
// // };
//
// export const play = async (audioUrl) => {
//     console.log("Attempting to play song with URL:", audioUrl);
//
//     if (!audioUrl) {
//         console.error('No audio URL provided');
//         return;
//     }
//
//     // Add validation to ensure the URL is correct before attempting to load it
//     if (!await isValidAudioUrl(audioUrl)) {
//         console.warn("Invalid audio URL for the track:", audioUrl);
//         return;
//     }
//
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
//
//     console.log("Initializing sound with URL:", audioUrl);
//     sound = new Sound(audioUrl, '', (error) => {
//         if (error) {
//             console.error('Error loading sound:', error);
//             return;
//         }
//
//         console.log('Sound loaded successfully');
//         sound.play((success) => {
//             if (success) {
//                 console.log('Song played successfully');
//             } else {
//                 console.error('Failed to play the song');
//             }
//         });
//     });
// };
//
// // Function to pause audio
// export const pause = () => {
//     if (sound) {
//         sound.pause();
//     }
// };
//
// // Function to stop audio
// export const stop = () => {
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
// };
//
// // Function to set the queue with fetched data
// export const setQueue = (songs) => {
//     dataQueue = songs;
// };
//
// // Function to get the current queue
// export const getQueue = () => {
//     return dataQueue;
// };
//
// // Function to fetch collection data from Firestore
// export const fetchCollectionData = async () => {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//
//         setQueue(musicData); // Set the data into the queue
//         return musicData;
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// };
//
// // Function to fetch a single document data from Firestore
// export const fetchDocumentData = async (docId) => {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             const data = { id: docSnapshot.id, ...docSnapshot.data() };
//             console.log("Fetched document data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No such document in Firestore");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// };
//
// // Function to fetch real-time data from Firebase Realtime Database
// export const fetchRealtimeData = async (path) => {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         if (snapshot.exists()) {
//             const data = snapshot.val();
//             console.log("Fetched Realtime Database data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No data available in Realtime Database at", path);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// };
//
// // // Play next song in the queue
// // export const playNext = async () => {
// //     if (dataQueue.length === 0) {
// //         console.warn('Queue is empty');
// //         return;
// //     }
// //
// //     currentSongIndex = (currentSongIndex + 1) % dataQueue.length;
// //     const nextSong = dataQueue[currentSongIndex];
// //     console.log('Next song:', nextSong);
// //     if (nextSong && nextSong.audioUrl) {
// //         await play(nextSong.audioUrl);
// //     } else {
// //         console.warn('Invalid audio URL for the next track');
// //     }
// // };
// //
// // // Play previous song in the queue
// // export const playPrevious = async () => {
// //     if (dataQueue.length === 0) {
// //         console.warn('Queue is empty');
// //         return;
// //     }
// //
// //     currentSongIndex = (currentSongIndex - 1 + dataQueue.length) % dataQueue.length;
// //     const previousSong = dataQueue[currentSongIndex];
// //     console.log('Previous song:', previousSong);
// //     if (previousSong && previousSong.audioUrl) {
// //         await play(previousSong.audioUrl);
// //     } else {
// //         console.warn('Invalid audio URL for the previous track');
// //     }
// // };
//
// // Play next song in the queue
// export const playNext = async () => {
//     if (dataQueue.length === 0) {
//         console.warn('Queue is empty');
//         return;
//     }
//
//     currentSongIndex = (currentSongIndex + 1) % dataQueue.length;
//     const nextSong = dataQueue[currentSongIndex];
//     console.log('Next song:', nextSong);
//
//     // Ensure you're using the correct key for the audio URL
//     if (nextSong && nextSong.mp3) {
//         await play(nextSong.mp3); // Use nextSong.mp3 instead of nextSong.audioUrl
//     } else {
//         console.warn('Invalid audio URL for the next track');
//     }
// };
//
// // Play previous song in the queue
// export const playPrevious = async () => {
//     if (dataQueue.length === 0) {
//         console.warn('Queue is empty');
//         return;
//     }
//
//     currentSongIndex = (currentSongIndex - 1 + dataQueue.length) % dataQueue.length;
//     const previousSong = dataQueue[currentSongIndex];
//     console.log('Previous song:', previousSong);
//
//     // Ensure you're using the correct key for the audio URL
//     if (previousSong && previousSong.mp3) {
//         await play(previousSong.mp3); // Use previousSong.mp3 instead of previousSong.audioUrl
//     } else {
//         console.warn('Invalid audio URL for the previous track');
//     }
// };
//
//
// // Export all functions and data queue for use in other components
// export default {
//     play,
//     pause,
//     stop,
//     fetchCollectionData,
//     fetchDocumentData,
//     fetchRealtimeData,
//     setQueue,
//     getQueue,
//     playNext,
//     playPrevious
// };
//
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { ref, get, child } from "firebase/database";
// import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
// import Sound from 'react-native-sound';
//
// let sound = null;
// let dataQueue = []; // Store data locally in the service
// let currentSongIndex = -1; // Track the index of the currently playing song
//
// // Helper function to validate if the audio URL is accessible with retry mechanism
// const isValidAudioUrl = async (url, retries = 3) => {
//     try {
//         console.log('Checking URL:', url);
//         if (!url) {
//             console.warn('URL is undefined or null');
//             return false;
//         }
//         const response = await fetch(url, { method: 'HEAD' });
//         if (response.ok) {
//             console.log('URL is valid:', url);
//             return true;
//         } else {
//             console.warn('URL not valid:', url);
//             return false;
//         }
//     } catch (error) {
//         if (retries > 0) {
//             console.log('Retrying URL validation...');
//             return await isValidAudioUrl(url, retries - 1);
//         } else {
//             console.error('Failed to validate URL:', url, error);
//             return false;
//         }
//     }
// };
//
// // Function to play audio with added logging for better debugging
// export const play = async (audioUrl) => {
//     console.log("Attempting to play song with URL:", audioUrl);
//
//     if (!audioUrl) {
//         console.error('No audio URL provided');
//         return;
//     }
//
//     // Add validation to ensure the URL is correct before attempting to load it
//     if (!await isValidAudioUrl(audioUrl)) {
//         console.warn("Invalid audio URL for the track:", audioUrl);
//         return;
//     }
//
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
//
//     console.log("Initializing sound with URL:", audioUrl);
//     sound = new Sound(audioUrl, '', (error) => {
//         if (error) {
//             console.error('Error loading sound:', error);
//             return;
//         }
//
//         console.log('Sound loaded successfully');
//         sound.play((success) => {
//             if (success) {
//                 console.log('Song played successfully');
//             } else {
//                 console.error('Failed to play the song');
//             }
//         });
//     });
// };
//
// // Function to pause audio
// export const pause = () => {
//     if (sound) {
//         sound.pause();
//     }
// };
//
// // Function to stop audio
// export const stop = () => {
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
// };
//
// // Function to set the queue with fetched data
// export const setQueue = (songs) => {
//     dataQueue = songs;
// };
//
// // Function to get the current queue
// export const getQueue = () => {
//     return dataQueue;
// };
//
// // Function to fetch collection data from Firestore
// export const fetchCollectionData = async () => {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//
//         setQueue(musicData); // Set the data into the queue
//         return musicData;
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// };
//
// // Function to fetch a single document data from Firestore
// export const fetchDocumentData = async (docId) => {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             const data = { id: docSnapshot.id, ...docSnapshot.data() };
//             console.log("Fetched document data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No such document in Firestore");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// };
//
// // Function to fetch real-time data from Firebase Realtime Database
// export const fetchRealtimeData = async (path) => {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         if (snapshot.exists()) {
//             const data = snapshot.val();
//             console.log("Fetched Realtime Database data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No data available in Realtime Database at", path);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// };
//
// // Play next song in the queue
// export const playNext = async () => {
//     if (dataQueue.length === 0) {
//         console.warn('Queue is empty');
//         return;
//     }
//
//     currentSongIndex = (currentSongIndex + 1) % dataQueue.length;
//     const nextSong = dataQueue[currentSongIndex];
//     console.log('Next song:', nextSong);
//
//     // Ensure you're using the correct key for the mp3 and image URLs
//     if (nextSong && nextSong.mp3 && nextSong.image) {
//         const audioUrl = nextSong.mp3;  // Extract mp3 URL
//         const imageUrl = nextSong.image; // Extract image URL
//
//         console.log("Playing audio from:", audioUrl);
//         console.log("Displaying image from:", imageUrl);
//
//         // Play the audio
//         stop(); // Stop the current audio before playing the next one
//         await play(audioUrl);
//
//         // Here you can implement additional logic to display the image (e.g., update state or UI)
//         // Example: update a state variable with the image URL for display
//         // setCurrentSongImage(imageUrl); // (This is just an example, adjust as needed)
//     } else {
//         console.warn('Invalid data for the next song (mp3 or image missing)');
//     }
// };
//
// // Play previous song in the queue
// export const playPrevious = async () => {
//     if (dataQueue.length === 0) {
//         console.warn('Queue is empty');
//         return;
//     }
//
//     currentSongIndex = (currentSongIndex - 1 + dataQueue.length) % dataQueue.length;
//     const previousSong = dataQueue[currentSongIndex];
//     console.log('Previous song:', previousSong);
//
//     // Ensure you're using the correct key for the mp3 and image URLs
//     if (previousSong && previousSong.mp3 && previousSong.image) {
//         const audioUrl = previousSong.mp3;  // Extract mp3 URL
//         const imageUrl = previousSong.image; // Extract image URL
//
//         console.log("Playing audio from:", audioUrl);
//         console.log("Displaying image from:", imageUrl);
//
//         //stop the current audio before playing the previous one
//         stop();
//
//         // Play the audio
//         await play(audioUrl);
//
//         // Here you can implement additional logic to display the image (e.g., update state or UI)
//         // Example: update a state variable with the image URL for display
//         // setCurrentSongImage(imageUrl); // (This is just an example, adjust as needed)
//     } else {
//         console.warn('Invalid data for the previous song (mp3 or image missing)');
//     }
// };
//
// // Export all functions and data queue for use in other components
// export default {
//     play,
//     pause,
//     stop,
//     fetchCollectionData,
//     fetchDocumentData,
//     fetchRealtimeData,
//     setQueue,
//     getQueue,
//     playNext,
//     playPrevious
// };
//
//
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { ref, get, child } from "firebase/database";
// import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
// import Sound from 'react-native-sound';
//
// let sound = null;
// let dataQueue = []; // Store data locally in the service
// let currentSongIndex = -1; // Track the index of the currently playing song
//
// // Helper function to validate if the audio URL is accessible with retry mechanism
// const isValidAudioUrl = async (url, retries = 3) => {
//     try {
//         console.log('Checking URL:', url);
//         if (!url) {
//             console.warn('URL is undefined or null');
//             return false;
//         }
//         const response = await fetch(url, { method: 'HEAD' });
//         if (response.ok) {
//             console.log('URL is valid:', url);
//             return true;
//         } else {
//             console.warn('URL not valid:', url);
//             return false;
//         }
//     } catch (error) {
//         if (retries > 0) {
//             console.log('Retrying URL validation...');
//             return await isValidAudioUrl(url, retries - 1);
//         } else {
//             console.error('Failed to validate URL:', url, error);
//             return false;
//         }
//     }
// };
//
// // Function to play audio with added logging for better debugging
// export const play = async (audioUrl) => {
//     console.log("Attempting to play song with URL:", audioUrl);
//
//     if (!audioUrl) {
//         console.error('No audio URL provided');
//         return;
//     }
//
//     // Add validation to ensure the URL is correct before attempting to load it
//     if (!await isValidAudioUrl(audioUrl)) {
//         console.warn("Invalid audio URL for the track:", audioUrl);
//         return;
//     }
//
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
//
//     console.log("Initializing sound with URL:", audioUrl);
//     sound = new Sound(audioUrl, '', (error) => {
//         if (error) {
//             console.error('Error loading sound:', error);
//             return;
//         }
//
//         console.log('Sound loaded successfully');
//         sound.play((success) => {
//             if (success) {
//                 console.log('Song played successfully');
//             } else {
//                 console.error('Failed to play the song');
//             }
//         });
//     });
// };
//
// // Function to pause audio
// export const pause = () => {
//     if (sound) {
//         sound.pause();
//     }
// };
//
// // Function to stop audio
// export const stop = () => {
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
// };
//
// // Function to set the queue with fetched data
// export const setQueue = (songs) => {
//     dataQueue = songs;
// };
//
// // Function to get the current queue
// export const getQueue = () => {
//     return dataQueue;
// };
//
// // Function to fetch collection data from Firestore
// export const fetchCollectionData = async () => {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//
//         setQueue(musicData); // Set the data into the queue
//         return musicData;
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// };
//
// // Function to fetch a single document data from Firestore
// export const fetchDocumentData = async (docId) => {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             const data = { id: docSnapshot.id, ...docSnapshot.data() };
//             console.log("Fetched document data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No such document in Firestore");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// };
//
// // Function to fetch real-time data from Firebase Realtime Database
// export const fetchRealtimeData = async (path) => {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         if (snapshot.exists()) {
//             const data = snapshot.val();
//             console.log("Fetched Realtime Database data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No data available in Realtime Database at", path);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// };
// export const playNext = async () => {
//     if (dataQueue.length === 0) {
//         console.warn('Queue is empty');
//         return;
//     }
//
//     currentSongIndex = (currentSongIndex + 1) % dataQueue.length;
//     const nextSong = dataQueue[currentSongIndex];
//     console.log('Next song:', nextSong);
//
//     if (nextSong && nextSong.mp3 && nextSong.image) {
//         const audioUrl = nextSong.mp3;
//         const imageUrl = nextSong.image;
//
//         console.log("Playing audio from:", audioUrl);
//         console.log("Displaying image from:", imageUrl);
//
//         stop();  // Stop the current audio before playing the next one
//         await play(audioUrl);
//
//         return nextSong;  // Return the next song's details
//     } else {
//         console.warn('Invalid data for the next song (mp3 or image missing)');
//     }
// };
//
// export const playPrevious = async () => {
//     if (dataQueue.length === 0) {
//         console.warn('Queue is empty');
//         return;
//     }
//
//     currentSongIndex = (currentSongIndex - 1 + dataQueue.length) % dataQueue.length;
//     const previousSong = dataQueue[currentSongIndex];
//     console.log('Previous song:', previousSong);
//
//     if (previousSong && previousSong.mp3 && previousSong.image) {
//         const audioUrl = previousSong.mp3;
//         const imageUrl = previousSong.image;
//
//         console.log("Playing audio from:", audioUrl);
//         console.log("Displaying image from:", imageUrl);
//
//         stop();  // Stop the current audio before playing the previous one
//         await play(audioUrl);
//
//         return previousSong;  // Return the previous song's details
//     } else {
//         console.warn('Invalid data for the previous song (mp3 or image missing)');
//     }
// };
//
//
// // Export all functions and data queue for use in other components
// export default {
//     play,
//     pause,
//     stop,
//     fetchCollectionData,
//     fetchDocumentData,
//     fetchRealtimeData,
//     setQueue,
//     getQueue,
//     playNext,
//     playPrevious
// };
//
//
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { ref, get, child } from "firebase/database";
// import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
// import Sound from 'react-native-sound';
//
// let sound = null;
// let dataQueue = []; // Store data locally in the service
// let currentSongIndex = -1; // Track the index of the currently playing song
//
// // Helper function to validate if the audio URL is accessible with retry mechanism
// const isValidAudioUrl = async (url, retries = 3) => {
//     try {
//         console.log('Checking URL:', url);
//         if (!url) {
//             console.warn('URL is undefined or null');
//             return false;
//         }
//         const response = await fetch(url, { method: 'HEAD' });
//         if (response.ok) {
//             console.log('URL is valid:', url);
//             return true;
//         } else {
//             console.warn('URL not valid:', url);
//             return false;
//         }
//     } catch (error) {
//         if (retries > 0) {
//             console.log('Retrying URL validation...');
//             return await isValidAudioUrl(url, retries - 1);
//         } else {
//             console.error('Failed to validate URL:', url, error);
//             return false;
//         }
//     }
// };
//
// // Function to play audio with added logging for better debugging
// export const play = async (audioUrl) => {
//     console.log("Attempting to play song with URL:", audioUrl);
//
//     if (!audioUrl) {
//         console.error('No audio URL provided');
//         return;
//     }
//
//     // Add validation to ensure the URL is correct before attempting to load it
//     if (!await isValidAudioUrl(audioUrl)) {
//         console.warn("Invalid audio URL for the track:", audioUrl);
//         return;
//     }
//
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
//
//     console.log("Initializing sound with URL:", audioUrl);
//     sound = new Sound(audioUrl, '', (error) => {
//         if (error) {
//             console.error('Error loading sound:', error);
//             return;
//         }
//
//         console.log('Sound loaded successfully');
//         sound.play((success) => {
//             if (success) {
//                 console.log('Song played successfully');
//             } else {
//                 console.error('Failed to play the song');
//             }
//         });
//     });
// };
//
// // Function to pause audio
// export const pause = () => {
//     if (sound) {
//         sound.pause();
//     }
// };
//
// // Function to stop audio
// export const stop = () => {
//     if (sound) {
//         sound.stop();
//         sound.release();
//     }
// };
//
// // Function to set the queue with fetched data
// export const setQueue = (songs) => {
//     dataQueue = songs;
// };
//
// // Function to get the current queue
// export const getQueue = () => {
//     return dataQueue;
// };
//
// // Function to fetch collection data from Firestore
// export const fetchCollectionData = async () => {
//     try {
//         const musicCollection = collection(FIREBASE_DB, "music");
//         const querySnapshot = await getDocs(musicCollection);
//         const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched collection data:", musicData);
//
//         setQueue(musicData); // Set the data into the queue
//         return musicData;
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//     }
// };
//
// // Function to fetch a single document data from Firestore
// export const fetchDocumentData = async (docId) => {
//     try {
//         const musicDoc = doc(FIREBASE_DB, "music", docId);
//         const docSnapshot = await getDoc(musicDoc);
//         if (docSnapshot.exists()) {
//             const data = { id: docSnapshot.id, ...docSnapshot.data() };
//             console.log("Fetched document data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No such document in Firestore");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching document data:", error);
//     }
// };
//
// // Function to fetch real-time data from Firebase Realtime Database
// export const fetchRealtimeData = async (path) => {
//     try {
//         const dbRef = ref(FIREBASE_DATABASE);
//         const snapshot = await get(child(dbRef, path));
//         if (snapshot.exists()) {
//             const data = snapshot.val();
//             console.log("Fetched Realtime Database data:", data);
//
//             dataQueue.push(data); // Optionally add to the queue if needed
//             return data;
//         } else {
//             console.log("No data available in Realtime Database at", path);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching Realtime Database data:", error);
//     }
// };
//
// // Play the next song in the queue
// export const playNext = async () => {
//     if (dataQueue.length === 0) {
//         console.warn('Queue is empty');
//         return;
//     }
//
//     currentSongIndex = (currentSongIndex + 1) % dataQueue.length;
//     const nextSong = dataQueue[currentSongIndex];
//     console.log('Next song:', nextSong);
//
//     if (nextSong && nextSong.mp3 && nextSong.image) {
//         const audioUrl = nextSong.mp3;
//         const imageUrl = nextSong.image;
//
//         console.log("Playing audio from:", audioUrl);
//         console.log("Displaying image from:", imageUrl);
//
//         stop();  // Stop the current audio before playing the next one
//         await play(audioUrl);
//
//         return nextSong;  // Return the next song's details
//     } else {
//         console.warn('Invalid data for the next song (mp3 or image missing)');
//     }
// };
//
// // Play the previous song in the queue
// export const playPrevious = async () => {
//     if (dataQueue.length === 0) {
//         console.warn('Queue is empty');
//         return;
//     }
//
//     currentSongIndex = (currentSongIndex - 1 + dataQueue.length) % dataQueue.length;
//     const previousSong = dataQueue[currentSongIndex];
//     console.log('Previous song:', previousSong);
//
//     if (previousSong && previousSong.mp3 && previousSong.image) {
//         const audioUrl = previousSong.mp3;
//         const imageUrl = previousSong.image;
//
//         console.log("Playing audio from:", audioUrl);
//         console.log("Displaying image from:", imageUrl);
//
//         stop();  // Stop the current audio before playing the previous one
//         await play(audioUrl);
//
//         return previousSong;  // Return the previous song's details
//     } else {
//         console.warn('Invalid data for the previous song (mp3 or image missing)');
//     }
// };
//
// export default {
//     play,
//     pause,
//     stop,
//     fetchCollectionData,
//     fetchDocumentData,
//     fetchRealtimeData,
//     setQueue,
//     getQueue,
//     playNext,
//     playPrevious
// };


import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { ref, get, child } from "firebase/database";
import { FIREBASE_DB, FIREBASE_DATABASE } from "../../../FirebaseConfig";
import Sound from 'react-native-sound';

let sound = null;
let dataQueue = []; // Store data locally in the service
let currentSongIndex = -1; // Track the index of the currently playing song
export const getSoundInstance = () => sound;

// Helper function to validate if the audio URL is accessible with retry mechanism
const isValidAudioUrl = async (url, retries = 3) => {
    try {
        console.log('Checking URL:', url);
        if (!url) {
            console.warn('URL is undefined or null');
            return false;
        }
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            console.log('URL is valid:', url);
            return true;
        } else {
            console.warn('URL not valid:', url);
            return false;
        }
    } catch (error) {
        if (retries > 0) {
            console.log('Retrying URL validation...');
            return await isValidAudioUrl(url, retries - 1);
        } else {
            console.error('Failed to validate URL:', url, error);
            return false;
        }
    }
};

// Function to play audio with added logging for better debugging
export const play = async (audioUrl) => {
    console.log("Attempting to play song with URL:", audioUrl);

    if (!audioUrl) {
        console.error('No audio URL provided');
        return;
    }

    // Add validation to ensure the URL is correct before attempting to load it
    if (!await isValidAudioUrl(audioUrl)) {
        console.warn("Invalid audio URL for the track:", audioUrl);
        return;
    }

    if (sound) {
        sound.stop();
        sound.release();
    }

    console.log("Initializing sound with URL:", audioUrl);
    sound = new Sound(audioUrl, '', (error) => {
        if (error) {
            console.error('Error loading sound:', error);
            return;
        }

        console.log('Sound loaded successfully');
        sound.play((success) => {
            if (success) {
                console.log('Song played successfully');
            } else {
                console.error('Failed to play the song');
            }
        });
    });
};

// Function to pause audio
export const pause = () => {
    if (sound) {
        sound.pause();
    }
};

// Function to stop audio
export const stop = () => {
    if (sound) {
        sound.stop();
        sound.release();
    }
};

// Function to set the queue with fetched data
export const setQueue = (songs) => {
    dataQueue = songs;
};

// Function to get the current queue
export const getQueue = () => {
    return dataQueue;
};

// Function to fetch collection data from Firestore
export const fetchCollectionData = async () => {
    try {
        const musicCollection = collection(FIREBASE_DB, "music");
        const querySnapshot = await getDocs(musicCollection);
        const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched collection data:", musicData);

        setQueue(musicData); // Set the data into the queue
        return musicData;
    } catch (error) {
        console.error("Error fetching collection data:", error);
    }
};

// Function to fetch a single document data from Firestore
export const fetchDocumentData = async (docId) => {
    try {
        const musicDoc = doc(FIREBASE_DB, "music", docId);
        const docSnapshot = await getDoc(musicDoc);
        if (docSnapshot.exists()) {
            const data = { id: docSnapshot.id, ...docSnapshot.data() };
            console.log("Fetched document data:", data);

            dataQueue.push(data); // Optionally add to the queue if needed
            return data;
        } else {
            console.log("No such document in Firestore");
            return null;
        }
    } catch (error) {
        console.error("Error fetching document data:", error);
    }
};

// Function to fetch real-time data from Firebase Realtime Database
export const fetchRealtimeData = async (path) => {
    try {
        const dbRef = ref(FIREBASE_DATABASE);
        const snapshot = await get(child(dbRef, path));
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("Fetched Realtime Database data:", data);

            dataQueue.push(data); // Optionally add to the queue if needed
            return data;
        } else {
            console.log("No data available in Realtime Database at", path);
            return null;
        }
    } catch (error) {
        console.error("Error fetching Realtime Database data:", error);
    }
};

// Play the next song in the queue
export const playNext = async () => {
    if (dataQueue.length === 0) {
        console.warn('Queue is empty');
        return;
    }

    currentSongIndex = (currentSongIndex + 1) % dataQueue.length;
    const nextSong = dataQueue[currentSongIndex];
    console.log('Next song:', nextSong);

    if (nextSong && nextSong.mp3 && nextSong.image) {
        const audioUrl = nextSong.mp3;
        const imageUrl = nextSong.image;

        console.log("Playing audio from:", audioUrl);
        console.log("Displaying image from:", imageUrl);

        stop();  // Stop the current audio before playing the next one
        await play(audioUrl);

        return nextSong;  // Return the next song's details
    } else {
        console.warn('Invalid data for the next song (mp3 or image missing)');
    }
};

// Play the previous song in the queue
export const playPrevious = async () => {
    if (dataQueue.length === 0) {
        console.warn('Queue is empty');
        return;
    }

    currentSongIndex = (currentSongIndex - 1 + dataQueue.length) % dataQueue.length;
    const previousSong = dataQueue[currentSongIndex];
    console.log('Previous song:', previousSong);

    if (previousSong && previousSong.mp3 && previousSong.image) {
        const audioUrl = previousSong.mp3;
        const imageUrl = previousSong.image;

        console.log("Playing audio from:", audioUrl);
        console.log("Displaying image from:", imageUrl);

        stop();  // Stop the current audio before playing the previous one
        await play(audioUrl);

        return previousSong;  // Return the previous song's details
    } else {
        console.warn('Invalid data for the previous song (mp3 or image missing)');
    }
};

// Ensure sound is initialized and playing before accessing position
export const getCurrentPosition = () => {
    return new Promise((resolve) => {
        if (typeof sound !== 'undefined' && sound && sound.isPlaying()) {
            sound.getCurrentTime((seconds) => resolve(seconds));
        } else {
            resolve(0);
        }
    });
};

// Ensure sound is initialized before getting duration
export const getDuration = () => {
    return typeof sound !== 'undefined' && sound ? sound.getDuration() : 0;
};

// Start tracking with an extra sound check in each interval
export const startPositionTracking = (onUpdate) => {
    if (!sound) return;

    const interval = setInterval(async () => {
        if (typeof sound !== 'undefined' && sound) {
            const position = await getCurrentPosition();
            const duration = getDuration();
            onUpdate(position, duration);
        }
    }, 1000);

    return () => clearInterval(interval); // Cleanup to stop tracking
};

export const seekTo = (position) => {
    if (sound) {
        sound.setCurrentTime(position);
    } else {
        console.warn("Sound is not initialized.");
    }
};


export default {
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
    setQueue,
    getQueue,
    playNext,
    playPrevious
};
