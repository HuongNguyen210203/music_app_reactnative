// // import React, { useEffect, useState, useRef } from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
// // import Slider from '@react-native-community/slider';
// // import MusicService from '../services/MusicService';
// // import { FIREBASE_STORAGE } from '../../../FirebaseConfig';
// // import { ref, listAll, getDownloadURL } from 'firebase/storage';
// // import Icon from 'react-native-vector-icons/FontAwesome';
// //
// // const MusicPlayer = ({ route }) => {
// //     const { title: initialTitle = 'Untitled', audioUrl = '' } = route?.params || {};
// //     const [images, setImages] = useState([]);
// //     const [songs, setSongs] = useState([]);
// //     const [currentTrackImage, setCurrentTrackImage] = useState('');
// //     const [currentPosition, setCurrentPosition] = useState(0);
// //     const [duration, setDuration] = useState(0);
// //     const [isPlaying, setIsPlaying] = useState(false);
// //     const [volume, setVolume] = useState(1);
// //     const [title, setTitle] = useState(initialTitle);
// //     const intervalRef = useRef(null);
// //
// //     // Rotation Animation setup
// //     const rotateAnim = useRef(new Animated.Value(0)).current;
// //
// //     // Rotation animation function
// //     const startRotation = () => {
// //         Animated.loop(
// //             Animated.timing(rotateAnim, {
// //                 toValue: 1,
// //                 duration: 11000, // 8 seconds for a full rotation
// //                 useNativeDriver: true,
// //             })
// //         ).start();
// //     };
// //
// //     // Stop rotation
// //     const stopRotation = () => {
// //         rotateAnim.stopAnimation();
// //         rotateAnim.setValue(0); // Reset rotation to start
// //     };
// //
// //     // Start or stop rotation based on play state
// //     useEffect(() => {
// //         if (isPlaying) {
// //             startRotation();
// //         } else {
// //             stopRotation();
// //         }
// //     }, [isPlaying]);
// //
// //     useEffect(() => {
// //         const fetchSongsAndImages = async () => {
// //             const storageRef = ref(FIREBASE_STORAGE, 'Music');
// //             const imagesRef = ref(FIREBASE_STORAGE, 'Images');
// //             try {
// //                 // Fetch Songs
// //                 const songResult = await listAll(storageRef);
// //                 const songPromises = songResult.items.map(async (itemRef) => {
// //                     const url = await getDownloadURL(itemRef);
// //                     return {
// //                         title: itemRef.name.split('.')[0],
// //                         url,
// //                         author: 'HIEUTHUHAI',
// //                     };
// //                 });
// //                 const songsData = await Promise.all(songPromises);
// //                 setSongs(songsData);
// //                 MusicService.initializeQueue(songsData);
// //
// //                 // Fetch Images
// //                 const imageResult = await listAll(imagesRef);
// //                 const imagePromises = imageResult.items.map(async (itemRef) => {
// //                     const url = await getDownloadURL(itemRef);
// //                     return { title: itemRef.name.split('.')[0], url };
// //                 });
// //                 const imagesData = await Promise.all(imagePromises);
// //                 setImages(imagesData);
// //
// //                 const matchedImage = getImageForSong(initialTitle);
// //                 setCurrentTrackImage(matchedImage);
// //             } catch (error) {
// //                 console.error('Error fetching data from Firebase Storage:', error);
// //             }
// //         };
// //
// //         fetchSongsAndImages();
// //     }, [initialTitle]);
// //
// //     const normalizeString = (str) => {
// //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //     const getImageForSong = (songTitle) => {
// //         const normalizedSongTitle = normalizeString(songTitle);
// //         let bestMatch = null;
// //         let maxMatchingChars = 0;
// //
// //         images.forEach((image) => {
// //             const normalizedImageTitle = normalizeString(image.title);
// //             let matchingChars = 0;
// //
// //             for (let i = 0; i < Math.min(normalizedSongTitle.length, normalizedImageTitle.length); i++) {
// //                 if (normalizedSongTitle[i] === normalizedImageTitle[i]) {
// //                     matchingChars++;
// //                 } else {
// //                     break;
// //                 }
// //             }
// //
// //             if (matchingChars > maxMatchingChars) {
// //                 maxMatchingChars = matchingChars;
// //                 bestMatch = image;
// //             }
// //         });
// //
// //         return bestMatch ? bestMatch.url : null;
// //     };
// //
// //     useEffect(() => {
// //         if (audioUrl) {
// //             loadTrack(audioUrl, initialTitle);
// //         }
// //
// //         return () => {
// //             MusicService.release();
// //             clearInterval(intervalRef.current); // clear the interval when unmounting
// //         };
// //     }, [audioUrl, initialTitle]);
// //
// //     const loadTrack = async (url, trackTitle) => {
// //         setCurrentPosition(0);
// //         setIsPlaying(true);
// //
// //         const matchedImage = getImageForSong(trackTitle);
// //         setCurrentTrackImage(matchedImage);
// //         setTitle(trackTitle);
// //
// //         try {
// //             const audioDuration = await MusicService.load(url);
// //             setDuration(audioDuration);
// //         } catch (error) {
// //             console.error('Error loading track:', error);
// //         }
// //
// //         MusicService.play();
// //         clearInterval(intervalRef.current);
// //         intervalRef.current = setInterval(() => {
// //             MusicService.getCurrentTime((seconds) => {
// //                 setCurrentPosition(seconds);
// //             });
// //         }, 1000);
// //     };
// //
// //     const handlePlayPause = () => {
// //         if (isPlaying) {
// //             MusicService.pause();
// //         } else {
// //             MusicService.play(() => setIsPlaying(false));
// //         }
// //         setIsPlaying(!isPlaying);
// //     };
// //
// //     const handleNextTrack = async () => {
// //         MusicService.stop();
// //         MusicService.nextTrack();
// //         const nextTrack = MusicService.getCurrentTrackInfo();
// //
// //         if (nextTrack) {
// //             await loadTrack(nextTrack.url, nextTrack.title);
// //             const matchedImage = getImageForSong(nextTrack.title);
// //             setCurrentTrackImage(matchedImage);
// //         }
// //     };
// //
// //     const handlePreviousTrack = async () => {
// //         MusicService.stop();
// //         MusicService.previousTrack();
// //         const previousTrack = MusicService.getCurrentTrackInfo();
// //
// //         if (previousTrack) {
// //             await loadTrack(previousTrack.url, previousTrack.title);
// //             const matchedImage = getImageForSong(previousTrack.title);
// //             setCurrentTrackImage(matchedImage);
// //         }
// //     };
// //
// //     const seekMusic = (value) => {
// //         MusicService.seekTo(value);
// //         setCurrentPosition(value);
// //     };
// //
// //     const changeVolume = (value) => {
// //         setVolume(value);
// //         MusicService.setVolume(value);
// //     };
// //
// //     const formatTime = (seconds) => {
// //         const mins = Math.floor(seconds / 60);
// //         const secs = Math.floor(seconds % 60);
// //         return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
// //     };
// //
// //     // Rotation interpolation
// //     const rotateInterpolate = rotateAnim.interpolate({
// //         inputRange: [0, 1],
// //         outputRange: ['0deg', '360deg'],
// //     });
// //
// //     return (
// //         <View style={styles.container}>
// //             {currentTrackImage ? (
// //                 <Animated.Image
// //                     source={{ uri: currentTrackImage }}
// //                     style={[styles.trackImage, { transform: [{ rotate: rotateInterpolate }] }]}
// //                 />
// //             ) : null}
// //             <Text style={styles.title}>{title}</Text>
// //
// //             <Slider
// //                 style={styles.progressSlider}
// //                 minimumValue={0}
// //                 maximumValue={duration}
// //                 value={currentPosition}
// //                 onSlidingComplete={seekMusic}
// //                 minimumTrackTintColor="#FFA500"
// //                 maximumTrackTintColor="#ccc"
// //                 thumbTintColor="#FFA500"
// //             />
// //             <View style={styles.timeContainer}>
// //                 <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
// //                 <Text style={styles.timeText}>{formatTime(duration)}</Text>
// //             </View>
// //
// //             <View style={styles.controlButtons}>
// //                 <TouchableOpacity onPress={handlePreviousTrack} style={styles.controlButton}>
// //                     <Icon name="step-backward" size={30} color="#FFA500" />
// //                 </TouchableOpacity>
// //                 <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
// //                     <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
// //                 </TouchableOpacity>
// //                 <TouchableOpacity onPress={handleNextTrack} style={styles.controlButton}>
// //                     <Icon name="step-forward" size={30} color="#FFA500" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Slider
// //                 style={styles.volumeSlider}
// //                 minimumValue={0}
// //                 maximumValue={1}
// //                 value={volume}
// //                 onValueChange={changeVolume}
// //                 minimumTrackTintColor="#FFA500"
// //                 maximumTrackTintColor="#ccc"
// //                 thumbTintColor="#FFA500"
// //             />
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: '#121212',
// //     },
// //     trackImage: {
// //         width: 250,
// //         height: 250,
// //         borderRadius: 125, // make the image circular
// //         marginBottom: 20,
// //     },
// //     title: {
// //         fontSize: 22,
// //         color: '#FFF',
// //         marginBottom: 10,
// //     },
// //     progressSlider: {
// //         width: '80%',
// //         height: 40,
// //     },
// //     timeContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         width: '80%',
// //     },
// //     timeText: {
// //         color: '#FFF',
// //     },
// //     controlButtons: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-around',
// //         width: '60%',
// //         marginTop: 20,
// //     },
// //     controlButton: {
// //         padding: 10,
// //     },
// //     volumeSlider: {
// //         width: '80%',
// //         height: 40,
// //         marginTop: 20,
// //     },
// // });
// //
// // export default MusicPlayer;
// //
//
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
// import Slider from '@react-native-community/slider';
// import MusicService from '../services/MusicService';
// import { FIREBASE_STORAGE } from '../../../FirebaseConfig';
// import { ref, listAll, getDownloadURL } from 'firebase/storage';
// import Icon from 'react-native-vector-icons/FontAwesome';
//
// const MusicPlayer = ({ route }) => {
//     const { title: initialTitle = 'Untitled', audioUrl = '', imageUrl = '' } = route?.params || {};
//     const [currentTrackImage, setCurrentTrackImage] = useState(imageUrl);
//     const [currentPosition, setCurrentPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [volume, setVolume] = useState(1);
//     const [title, setTitle] = useState(initialTitle);
//     const intervalRef = useRef(null);
//
//     // Rotation Animation setup
//     const rotateAnim = useRef(new Animated.Value(0)).current;
//
//     // Rotation animation function
//     const startRotation = () => {
//         Animated.loop(
//             Animated.timing(rotateAnim, {
//                 toValue: 1,
//                 duration: 11000, // 11 seconds for a full rotation
//                 useNativeDriver: true,
//             })
//         ).start();
//     };
//
//     // Stop rotation
//     const stopRotation = () => {
//         rotateAnim.stopAnimation();
//         rotateAnim.setValue(0); // Reset rotation to start
//     };
//
//     // Start or stop rotation based on play state
//     useEffect(() => {
//         if (isPlaying) {
//             startRotation();
//         } else {
//             stopRotation();
//         }
//     }, [isPlaying]);
//
//     useEffect(() => {
//         if (audioUrl) {
//             loadTrack(audioUrl, initialTitle);
//         }
//
//         return () => {
//             MusicService.release();
//             clearInterval(intervalRef.current); // Clear the interval when unmounting
//         };
//     }, [audioUrl, initialTitle]);
//
//     const loadTrack = async (url, trackTitle) => {
//         setCurrentPosition(0);
//         setIsPlaying(true);
//         setTitle(trackTitle);
//         setCurrentTrackImage(imageUrl); // Set the image directly from params
//
//         try {
//             const audioDuration = await MusicService.load(url);
//             setDuration(audioDuration);
//         } catch (error) {
//             console.error('Error loading track:', error);
//         }
//
//         MusicService.play();
//         clearInterval(intervalRef.current);
//         intervalRef.current = setInterval(() => {
//             MusicService.getCurrentTime((seconds) => {
//                 setCurrentPosition(seconds);
//             });
//         }, 1000);
//     };
//
//     const handlePlayPause = () => {
//         if (isPlaying) {
//             MusicService.pause();
//         } else {
//             MusicService.play(() => setIsPlaying(false));
//         }
//         setIsPlaying(!isPlaying);
//     };
//
//     const seekMusic = (value) => {
//         MusicService.seekTo(value);
//         setCurrentPosition(value);
//     };
//
//     const changeVolume = (value) => {
//         setVolume(value);
//         MusicService.setVolume(value);
//     };
//
//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//     };
//
//     // Rotation interpolation
//     const rotateInterpolate = rotateAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg'],
//     });
//
//     return (
//         <View style={styles.container}>
//             {currentTrackImage ? (
//                 <Animated.Image
//                     source={{ uri: currentTrackImage }}
//                     style={[styles.trackImage, { transform: [{ rotate: rotateInterpolate }] }]}
//                 />
//             ) : null}
//             <Text style={styles.title}>{title}</Text>
//
//             <Slider
//                 style={styles.progressSlider}
//                 minimumValue={0}
//                 maximumValue={duration}
//                 value={currentPosition}
//                 onSlidingComplete={seekMusic}
//                 minimumTrackTintColor="#FFA500"
//                 maximumTrackTintColor="#ccc"
//                 thumbTintColor="#FFA500"
//             />
//             <View style={styles.timeContainer}>
//                 <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
//                 <Text style={styles.timeText}>{formatTime(duration)}</Text>
//             </View>
//
//             <View style={styles.controlButtons}>
//                 <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
//                     <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
//                 </TouchableOpacity>
//             </View>
//
//             <Slider
//                 style={styles.volumeSlider}
//                 minimumValue={0}
//                 maximumValue={1}
//                 value={volume}
//                 onValueChange={changeVolume}
//                 minimumTrackTintColor="#FFA500"
//                 maximumTrackTintColor="#ccc"
//                 thumbTintColor="#FFA500"
//             />
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#121212',
//     },
//     trackImage: {
//         width: 250,
//         height: 250,
//         borderRadius: 125, // Make the image circular
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 22,
//         color: '#FFF',
//         marginBottom: 10,
//     },
//     progressSlider: {
//         width: '80%',
//         height: 40,
//     },
//     timeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '80%',
//     },
//     timeText: {
//         color: '#FFF',
//     },
//     controlButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '60%',
//         marginTop: 20,
//     },
//     controlButton: {
//         padding: 10,
//     },
//     volumeSlider: {
//         width: '80%',
//         height: 40,
//         marginTop: 20,
//     },
// });
//
// export default MusicPlayer;
//
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
// import Slider from '@react-native-community/slider';
// import MusicService from '../services/MusicService';
// import { FIREBASE_STORAGE } from '../../../FirebaseConfig';
// import { ref, listAll, getDownloadURL } from 'firebase/storage';
// import Icon from 'react-native-vector-icons/FontAwesome';
//
// const MusicPlayer = ({ route }) => {
//     const { title: initialTitle = 'Untitled', audioUrl = '', imageUrl = '' } = route?.params || {};
//     const [images, setImages] = useState([]);
//     const [songs, setSongs] = useState([]);
//     const [currentTrackImage, setCurrentTrackImage] = useState(imageUrl);
//     const [currentPosition, setCurrentPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [volume, setVolume] = useState(1);
//     const [title, setTitle] = useState(initialTitle);
//     const intervalRef = useRef(null);
//
//     // Rotation Animation setup
//     const rotateAnim = useRef(new Animated.Value(0)).current;
//
//     // Rotation animation function
//     const startRotation = () => {
//         Animated.loop(
//             Animated.timing(rotateAnim, {
//                 toValue: 1,
//                 duration: 11000, // Duration for a full rotation
//                 useNativeDriver: true,
//             })
//         ).start();
//     };
//
//     // Stop rotation
//     const stopRotation = () => {
//         rotateAnim.stopAnimation();
//         rotateAnim.setValue(0); // Reset rotation to start
//     };
//
//     // Start or stop rotation based on play state
//     useEffect(() => {
//         if (isPlaying) {
//             startRotation();
//         } else {
//             stopRotation();
//         }
//     }, [isPlaying]);
//
//     useEffect(() => {
//         const fetchSongs = async () => {
//             try {
//                 const musicFolderRef = ref(FIREBASE_STORAGE, 'Music/');
//                 const songFolders = await listAll(musicFolderRef);
//
//                 const songPromises = songFolders.prefixes.map(async (folderRef) => {
//                     const songData = {};
//                     const files = await listAll(folderRef);
//
//                     for (const item of files.items) {
//                         const url = await getDownloadURL(item);
//                         if (item.name.endsWith('.mp3')) {
//                             songData.mp3 = url;
//                             songData.title = item.name.replace('.mp3', ''); // Set title from MP3 file name
//                         } else if (item.name.endsWith('.jpg') || item.name.endsWith('.jpeg') || item.name.endsWith('.png')) {
//                             songData.image = url;
//                         }
//                     }
//
//                     return songData;
//                 });
//
//                 const songsData = await Promise.all(songPromises);
//                 setSongs(songsData.filter(song => song.mp3)); // Filter out songs without mp3 URLs
//                 MusicService.initializeQueue(songsData);
//             } catch (error) {
//                 console.error('Error fetching songs from Firebase Storage:', error);
//             }
//         };
//
//         fetchSongs();
//     }, []);
//
//     useEffect(() => {
//         if (audioUrl) {
//             loadTrack(audioUrl, initialTitle);
//         }
//
//         return () => {
//             MusicService.release();
//             clearInterval(intervalRef.current); // Clear the interval when unmounting
//         };
//     }, [audioUrl, initialTitle]);
//
//     const loadTrack = async (url, trackTitle) => {
//         setCurrentPosition(0);
//         setIsPlaying(true);
//         setTitle(trackTitle);
//
//         try {
//             const audioDuration = await MusicService.load(url);
//             setDuration(audioDuration);
//             MusicService.play();
//             clearInterval(intervalRef.current);
//             intervalRef.current = setInterval(() => {
//                 MusicService.getCurrentTime((seconds) => {
//                     setCurrentPosition(seconds);
//                 });
//             }, 1000);
//         } catch (error) {
//             console.error('Error loading track:', error);
//         }
//     };
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
//     const handleNextTrack = async () => {
//         MusicService.stop();
//         MusicService.nextTrack(); // Navigate to the next track
//         const nextTrack = MusicService.getCurrentTrackInfo(); // Fetch the next track info
//
//         if (nextTrack) {
//             await loadTrack(nextTrack.mp3, nextTrack.title || 'Untitled'); // Load the next track with fallback
//             setCurrentTrackImage(nextTrack.image || ''); // Update the track image with fallback
//         }
//     };
//
//     const handlePreviousTrack = async () => {
//         MusicService.stop();
//         MusicService.previousTrack(); // Navigate to the previous track
//         const previousTrack = MusicService.getCurrentTrackInfo(); // Fetch the previous track info
//
//         if (previousTrack) {
//             await loadTrack(previousTrack.mp3, previousTrack.title || 'Untitled'); // Load the previous track with fallback
//             setCurrentTrackImage(previousTrack.image || ''); // Update the track image with fallback
//         }
//     };
//
//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//     };
//
//     // Rotation interpolation
//     const rotateInterpolate = rotateAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg'],
//     });
//
//     return (
//         <View style={styles.container}>
//             {currentTrackImage ? (
//                 <Animated.Image
//                     source={{ uri: currentTrackImage }}
//                     style={[styles.trackImage, { transform: [{ rotate: rotateInterpolate }] }]}
//                 />
//             ) : null}
//             <Text style={styles.title}>{title}</Text>
//
//             <Slider
//                 style={styles.progressSlider}
//                 minimumValue={0}
//                 maximumValue={duration}
//                 value={currentPosition}
//                 onSlidingComplete={(value) => MusicService.seekTo(value)} // Implement seeking
//                 minimumTrackTintColor="#FFA500"
//                 maximumTrackTintColor="#ccc"
//                 thumbTintColor="#FFA500"
//             />
//             <View style={styles.timeContainer}>
//                 <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
//                 <Text style={styles.timeText}>{formatTime(duration)}</Text>
//             </View>
//
//             <View style={styles.controlButtons}>
//                 <TouchableOpacity onPress={handlePreviousTrack} style={styles.controlButton}>
//                     <Icon name="step-backward" size={30} color="#FFA500" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
//                     <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleNextTrack} style={styles.controlButton}>
//                     <Icon name="step-forward" size={30} color="#FFA500" />
//                 </TouchableOpacity>
//             </View>
//
//             <Slider
//                 style={styles.volumeSlider}
//                 minimumValue={0}
//                 maximumValue={1}
//                 value={volume}
//                 onValueChange={(value) => {
//                     setVolume(value);
//                     MusicService.setVolume(value);
//                 }}
//                 minimumTrackTintColor="#FFA500"
//                 maximumTrackTintColor="#ccc"
//                 thumbTintColor="#FFA500"
//             />
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#121212',
//     },
//     trackImage: {
//         width: 250,
//         height: 250,
//         borderRadius: 125, // Make the image circular
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 22,
//         color: '#FFF',
//         marginBottom: 10,
//     },
//     progressSlider: {
//         width: '80%',
//         height: 40,
//     },
//     timeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '80%',
//     },
//     timeText: {
//         color: '#FFF',
//     },
//     controlButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '60%',
//         marginTop: 20,
//     },
//     controlButton: {
//         padding: 10,
//     },
//     volumeSlider: {
//         width: '80%',
//         height: 40,
//         marginTop: 20,
//     },
// });
//
// export default MusicPlayer;//play nhạc từ list

// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
// import Slider from '@react-native-community/slider';
// import MusicService from '../services/MusicService';
// import { FIREBASE_STORAGE } from '../../../FirebaseConfig';
// import { ref, listAll, getDownloadURL } from 'firebase/storage';
// import Icon from 'react-native-vector-icons/FontAwesome';
//
// const MusicPlayer = ({ route }) => {
//     const [songsQueue, setSongsQueue] = useState([]);
//     const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [currentPosition, setCurrentPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const intervalRef = useRef(null);
//
//     // Fetch songs and initialize queue
//     useEffect(() => {
//         const fetchSongs = async () => {
//             try {
//                 const musicFolderRef = ref(FIREBASE_STORAGE, 'Music/');
//                 const songFolders = await listAll(musicFolderRef);
//
//                 const songPromises = songFolders.prefixes.map(async (folderRef) => {
//                     const songId = folderRef.name;
//                     let songData = { id: songId };
//
//                     const files = await listAll(folderRef);
//                     for (const item of files.items) {
//                         const url = await getDownloadURL(item);
//                         if (item.name.endsWith('.mp3')) {
//                             songData = { ...songData, mp3: url, title: item.name.replace('.mp3', '') };
//                         } else if (item.name.endsWith('.jpg') || item.name.endsWith('.png')) {
//                             songData = { ...songData, image: url };
//                         }
//                     }
//                     return songData;
//                 });
//
//                 const songsData = await Promise.all(songPromises);
//                 setSongsQueue(songsData);
//                 if (songsData.length > 0) {
//                     loadTrack(songsData[0]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching songs from Firebase Storage:', error);
//             }
//         };
//
//         fetchSongs();
//     }, []);
//
//     const loadTrack = async (track) => {
//         if (!track || !track.mp3) {
//             console.error("Audio URL is missing. Unable to load track.");
//             return;
//         }
//
//         try {
//             setIsPlaying(true);
//             setCurrentPosition(0);
//
//             const audioDuration = await MusicService.load(track.mp3);
//             setDuration(audioDuration);
//
//             MusicService.play();
//             intervalRef.current = setInterval(() => {
//                 MusicService.getCurrentTime((seconds) => setCurrentPosition(seconds));
//             }, 1000);
//         } catch (error) {
//             console.error('Error loading track:', error);
//         }
//     };
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
//         const nextIndex = (currentTrackIndex + 1) % songsQueue.length;
//         setCurrentTrackIndex(nextIndex);
//         loadTrack(songsQueue[nextIndex]);
//     };
//
//     const handlePreviousTrack = () => {
//         const prevIndex = (currentTrackIndex - 1 + songsQueue.length) % songsQueue.length;
//         setCurrentTrackIndex(prevIndex);
//         loadTrack(songsQueue[prevIndex]);
//     };
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>{songsQueue[currentTrackIndex]?.title || 'Untitled'}</Text>
//
//             {songsQueue[currentTrackIndex]?.image && (
//                 <Image source={{ uri: songsQueue[currentTrackIndex].image }} style={styles.trackImage} />
//             )}
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
//             <View style={styles.controlButtons}>
//                 <TouchableOpacity onPress={handlePreviousTrack} style={styles.controlButton}>
//                     <Icon name="step-backward" size={30} color="#FFA500" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
//                     <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleNextTrack} style={styles.controlButton}>
//                     <Icon name="step-forward" size={30} color="#FFA500" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
//     title: { fontSize: 22, color: '#FFF', marginBottom: 10 },
//     trackImage: { width: 250, height: 250, borderRadius: 125, marginBottom: 20 },
//     progressSlider: { width: '80%', height: 40 },
//     controlButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '60%', marginTop: 20 },
//     controlButton: { padding: 10 },
// });
//
// export default MusicPlayer;//pkay next and previuos track
//
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
// import Slider from '@react-native-community/slider';
// import MusicService from '../services/MusicService';
// import { FIREBASE_STORAGE } from '../../../FirebaseConfig';
// import { ref, listAll, getDownloadURL } from 'firebase/storage';
// import Icon from 'react-native-vector-icons/FontAwesome';
//
// const MusicPlayer = ({ route }) => {
//     const [songsQueue, setSongsQueue] = useState([]);
//     const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [currentPosition, setCurrentPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const intervalRef = useRef(null);
//
//     // Fetch songs and initialize queue
//     useEffect(() => {
//         const fetchSongs = async () => {
//             try {
//                 const musicFolderRef = ref(FIREBASE_STORAGE, 'Music/');
//                 const songFolders = await listAll(musicFolderRef);
//
//                 const songPromises = songFolders.prefixes.map(async (folderRef) => {
//                     const songId = folderRef.name;
//                     let songData = { id: songId };
//
//                     const files = await listAll(folderRef);
//                     for (const item of files.items) {
//                         const url = await getDownloadURL(item);
//                         if (item.name.endsWith('.mp3')) {
//                             songData = { ...songData, mp3: url, title: item.name.replace('.mp3', '') };
//                         } else if (item.name.endsWith('.jpg') || item.name.endsWith('.jpeg') || item.name.endsWith('.png')) {
//                             songData = { ...songData, image: url };
//                         }
//                     }
//                     return songData;
//                 });
//
//                 const songsData = await Promise.all(songPromises);
//                 setSongsQueue(songsData);
//                 if (songsData.length > 0) {
//                     loadTrack(songsData[0]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching songs from Firebase Storage:', error);
//             }
//         };
//
//         fetchSongs();
//     }, []);
//
//     const loadTrack = async (track) => {
//         if (!track || !track.mp3) {
//             console.error("Audio URL is missing. Unable to load track.");
//             return;
//         }
//
//         try {
//             setIsPlaying(true);
//             setCurrentPosition(0);
//
//             const audioDuration = await MusicService.load(track.mp3);
//             setDuration(audioDuration);
//
//             MusicService.play();
//             intervalRef.current = setInterval(() => {
//                 MusicService.getCurrentTime((seconds) => setCurrentPosition(seconds));
//             }, 1000);
//         } catch (error) {
//             console.error('Error loading track:', error);
//         }
//     };
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
//         const nextIndex = (currentTrackIndex + 1) % songsQueue.length;
//         setCurrentTrackIndex(nextIndex);
//         loadTrack(songsQueue[nextIndex]);
//     };
//
//     const handlePreviousTrack = () => {
//         const prevIndex = (currentTrackIndex - 1 + songsQueue.length) % songsQueue.length;
//         setCurrentTrackIndex(prevIndex);
//         loadTrack(songsQueue[prevIndex]);
//     };
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>{songsQueue[currentTrackIndex]?.title || 'Untitled'}</Text>
//
//             {songsQueue[currentTrackIndex]?.image && (
//                 <Image source={{ uri: songsQueue[currentTrackIndex].image }} style={styles.trackImage} />
//             )}
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
//                     <Icon name="step-backward" size={30} color="#FFA500" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
//                     <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleNextTrack} style={styles.controlButton}>
//                     <Icon name="step-forward" size={30} color="#FFA500" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#121212',
//     },
//     trackImage: {
//         width: 250,
//         height: 250,
//         borderRadius: 125,
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 22,
//         color: '#FFF',
//         marginBottom: 10,
//     },
//     progressSlider: {
//         width: '80%',
//         height: 40,
//     },
//     controlButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '60%',
//         marginTop: 20,
//     },
//     controlButton: {
//         padding: 10,
//     },
// });
//
// // export default MusicPlayer;
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
//         MusicService.nextTrack(); // Call nextTrack function
//         setCurrentPosition(0); // Reset current position when switching to next track
//     };
//
//     const handlePreviousTrack = () => {
//         MusicService.previousTrack(); // Call previousTrack function
//         setCurrentPosition(0); // Reset current position when switching to previous track
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
//
//                 <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
//                     <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
//                 </TouchableOpacity>
//
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
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import MusicService from '../services/MusicService';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Slider from '@react-native-community/slider';
//
// const MusicPlayer = ({ route, navigation }) => {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [currentPosition, setCurrentPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [currentSong, setCurrentSong] = useState(null);
//     const intervalRef = useRef(null);
//
//     useEffect(() => {
//         // Load the initial song from MusicService queue
//         const loadInitialSong = async () => {
//             const song = MusicService.getCurrentSong();
//             if (song) {
//                 await loadTrack(song);
//             }
//         };
//
//         loadInitialSong();
//
//         return () => {
//             clearInterval(intervalRef.current);
//             MusicService.stop();
//         };
//     }, []);
//
//     const loadTrack = async (song) => {
//         setCurrentSong(song);
//         setIsPlaying(true);
//         setCurrentPosition(0);
//
//         const audioDuration = await MusicService.load(song.audioUrl);
//         setDuration(audioDuration);
//
//         MusicService.play();
//         intervalRef.current = setInterval(() => {
//             MusicService.getCurrentTime((seconds) => setCurrentPosition(seconds));
//         }, 1000);
//     };
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
//     const handleNextTrack = async () => {
//         const nextSong = MusicService.getNextSong();
//         if (nextSong) {
//             await loadTrack(nextSong);
//         }
//     };
//
//     const handlePreviousTrack = async () => {
//         const previousSong = MusicService.getPreviousSong();
//         if (previousSong) {
//             await loadTrack(previousSong);
//         }
//     };
//
//     return (
//         <View style={styles.container}>
//             {currentSong && (
//                 <>
//                     <Text style={styles.title}>{currentSong.title}</Text>
//                     <Text style={styles.artist}>{currentSong.artist}</Text>
//                     {currentSong.image && (
//                         <Image source={{ uri: currentSong.image }} style={styles.trackImage} />
//                     )}
//                 </>
//             )}
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
//
//                 <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
//                     <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
//                 </TouchableOpacity>
//
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


// // MusicPlayer.js
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import MusicService from '../services/MusicService'; // Import the MusicService
//
// const MusicPlayer = ({ route, navigation }) => {
//     const { title, audioUrl, imageUrl, artist, playlist } = route.params;
//
//     // Validate playlist
//     if (!playlist || playlist.length === 0) {
//         console.error("Playlist is empty or not passed correctly.");
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.errorText}>No songs available in the playlist.</Text>
//             </View>
//         );
//     }
//
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [currentSongIndex, setCurrentSongIndex] = useState(0);
//     const [currentSong, setCurrentSong] = useState({ title, audioUrl, imageUrl, artist });
//
//     // Initialize the music player with the first song
//     useEffect(() => {
//         if (playlist.length > 0) {
//             MusicService.play(audioUrl);
//             setIsPlaying(true);
//         }
//
//         return () => {
//             MusicService.stop(); // Clean up by stopping the song when the player is unmounted
//         };
//     }, [audioUrl, playlist]);
//
//     const handlePlayPause = () => {
//         if (isPlaying) {
//             MusicService.pause();
//         } else {
//             MusicService.play(currentSong.audioUrl);
//         }
//         setIsPlaying(!isPlaying);
//     };
//
//     const handleStop = () => {
//         MusicService.stop();
//         setIsPlaying(false);
//     };
//
//     const handleNextTrack = () => {
//         let nextIndex = currentSongIndex + 1;
//         if (nextIndex >= playlist.length) nextIndex = 0; // Loop back to the first song
//         setCurrentSongIndex(nextIndex);
//         setCurrentSong(playlist[nextIndex]);
//         MusicService.play(playlist[nextIndex].audioUrl);
//         setIsPlaying(true);
//     };
//
//     const handlePreviousTrack = () => {
//         let prevIndex = currentSongIndex - 1;
//         if (prevIndex < 0) prevIndex = playlist.length - 1; // Loop back to the last song
//         setCurrentSongIndex(prevIndex);
//         setCurrentSong(playlist[prevIndex]);
//         MusicService.play(playlist[prevIndex].audioUrl);
//         setIsPlaying(true);
//     };
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-left" size={25} color="#FFA500" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerText}>Now Playing</Text>
//             </View>
//
//             <View style={styles.playerContainer}>
//                 <Image source={{ uri: currentSong.imageUrl }} style={styles.songImage} />
//                 <Text style={styles.songTitle}>{currentSong.title}</Text>
//                 <Text style={styles.songArtist}>{currentSong.artist}</Text>
//
//                 <View style={styles.controls}>
//                     <TouchableOpacity onPress={handlePreviousTrack} style={styles.controlButton}>
//                         <Icon name="backward" size={40} color="#FFA500" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={handleStop} style={styles.controlButton}>
//                         <Icon name="stop-circle" size={40} color="#FFA500" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
//                         <Icon name={isPlaying ? "pause-circle" : "play-circle"} size={50} color="#FFA500" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={handleNextTrack} style={styles.controlButton}>
//                         <Icon name="forward" size={40} color="#FFA500" />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#121212',
//         padding: 20,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     headerText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#FFA500',
//     },
//     playerContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     songImage: {
//         width: 150,
//         height: 150,
//         borderRadius: 10,
//         marginBottom: 20,
//         borderColor: '#FFA500',
//         borderWidth: 2,
//     },
//     songTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#FFA500',
//         marginBottom: 10,
//     },
//     songArtist: {
//         fontSize: 16,
//         color: '#BBB',
//         marginBottom: 20,
//     },
//     controls: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '100%',
//     },
//     controlButton: {
//         padding: 10,
//     },
//     errorText: {
//         color: '#FF0000',
//         fontSize: 18,
//         textAlign: 'center',
//     },
// });
//
// export default MusicPlayer;






// import React, { useEffect } from 'react';
// import { View, Text, Button, Image } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import musicService from '../services/MusicService'; // Assuming this is the correct path
//
// const MusicPlayer = () => {
//     const route = useRoute();
//     const { title, audioUrl, imageUrl, artist } = route.params;
//
//     useEffect(() => {
//         console.log("Received audio URL:", audioUrl);
//         // If audioUrl is not undefined or null, attempt to play
//         if (audioUrl) {
//             musicService.play(audioUrl);
//         } else {
//             console.warn("Received invalid audio URL:", audioUrl);
//         }
//     }, [audioUrl]);
//
//     const handleNext = () => {
//         musicService.playNext();
//     };
//
//     const handlePrevious = () => {
//         musicService.playPrevious();
//     };
//
//     return (
//         <View>
//             <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
//             <Text>{title}</Text>
//             <Text>{artist}</Text>
//             <Button title="Previous" onPress={handlePrevious} />
//             <Button title="Next" onPress={handleNext} />
//         </View>
//     );
// };
//
// // export default MusicPlayer;


// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import musicService from '../services/MusicService';
// import { Easing } from 'react-native';
//
// const MusicPlayer = () => {
//     const route = useRoute();
//     const { title, audioUrl, imageUrl, artist } = route.params;
//
//     const [currentTitle, setCurrentTitle] = useState(title);
//     const [currentImage, setCurrentImage] = useState(imageUrl);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const rotation = useRef(new Animated.Value(0));
//     const rotationLoop = useRef(null);
//
//     useEffect(() => {
//         const initializeAudio = async () => {
//             if (await isValidAudioUrl(audioUrl)) {
//                 musicService.play(audioUrl);
//                 setIsPlaying(true);
//                 setErrorMessage('');
//                 startRotation();
//             } else {
//                 setErrorMessage("Invalid audio URL.");
//             }
//         };
//         initializeAudio();
//
//         return () => {
//             musicService.stop();
//             stopRotation();
//         };
//     }, [audioUrl]);
//
//     const handleNext = async () => {
//         const nextSong = await musicService.playNext();
//         if (nextSong) {
//             setCurrentTitle(nextSong.title);
//             setCurrentImage(nextSong.image);
//             startRotation();
//         }
//     };
//
//     const handlePrevious = async () => {
//         const prevSong = await musicService.playPrevious();
//         if (prevSong) {
//             setCurrentTitle(prevSong.title);
//             setCurrentImage(prevSong.image);
//             startRotation();
//         }
//     };
//
//     const handlePlayPause = () => {
//         if (isPlaying) {
//             musicService.pause();
//             stopRotation();
//         } else {
//             musicService.play(audioUrl);
//             startRotation();
//         }
//         setIsPlaying(!isPlaying);
//     };
//
//     const startRotation = () => {
//         rotationLoop.current?.start();
//     };
//
//     const stopRotation = () => {
//         rotationLoop.current?.stop();
//     };
//
//     const rotationInterpolation = rotation.current.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg'],
//     });
//
//     useEffect(() => {
//         rotationLoop.current = Animated.loop(
//             Animated.timing(rotation.current, {
//                 toValue: 1,
//                 duration: 4000,
//                 useNativeDriver: true,
//                 easing: Easing.linear,
//             })
//         );
//     }, []);
//
//     return (
//         <View style={styles.container}>
//             {errorMessage ? (
//                 <Text style={styles.errorText}>{errorMessage}</Text>
//             ) : (
//                 <>
//                     <Animated.Image
//                         source={{ uri: currentImage }}
//                         style={[styles.songImage, { transform: [{ rotate: rotationInterpolation }] }]}
//                     />
//                     <Text style={styles.songTitle}>{currentTitle}</Text>
//                     <Text style={styles.songArtist}>{artist}</Text>
//                     <View style={styles.controls}>
//                         <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
//                             <Icon name="backward" size={30} color="#FFA500" />
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
//                             <Icon
//                                 name={isPlaying ? "pause" : "play"}
//                                 size={40}
//                                 color="#fff"
//                             />
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
//                             <Icon name="forward" size={30} color="#FFA500" />
//                         </TouchableOpacity>
//                     </View>
//                 </>
//             )}
//         </View>
//     );
// };
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#121212',
//         padding: 20
//     },
//     songImage: {
//         width: 250,
//         height: 250,
//         borderRadius: 125, // Makes the image circular
//         marginBottom: 20,
//         borderWidth: 2,
//         borderColor: '#FFA500',
//         shadowColor: '#000',
//         shadowOpacity: 0.3,
//         shadowRadius: 10,
//         shadowOffset: { width: 0, height: 4 }
//     },
//     songTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#FFA500',
//         marginBottom: 10
//     },
//     songArtist: {
//         fontSize: 16,
//         color: '#BBB',
//         marginBottom: 20
//     },
//     controls: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '80%',
//         marginTop: 20
//     },
//     controlButton: {
//         padding: 10,
//     },
//     playPauseButton: {
//         backgroundColor: '#FFA500',
//         padding: 15,
//         borderRadius: 50,
//         shadowColor: '#000',
//         shadowOpacity: 0.3,
//         shadowRadius: 10,
//         shadowOffset: { width: 0, height: 4 },
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     errorText: {
//         color: 'red',
//         fontSize: 18,
//         textAlign: 'center',
//         marginBottom: 20
//     },
// });
//
// // export default MusicPlayer;



// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import musicService from '../services/MusicService';
// import { Easing } from 'react-native';
//
// const MusicPlayer = () => {
//     const route = useRoute();
//     const { title, audioUrl, imageUrl, artist } = route.params;
//
//     const [currentTitle, setCurrentTitle] = useState(title);
//     const [currentImage, setCurrentImage] = useState(imageUrl);
//     const [currentArtist, setCurrentArtist] = useState(artist);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const rotation = useRef(new Animated.Value(0));
//     const rotationLoop = useRef(null);
//
//     useEffect(() => {
//         // Initialize and play new audio if valid URL
//         const initializeAudio = async () => {
//             musicService.stop(); // Stop any currently playing song
//             await musicService.play(audioUrl);
//             setIsPlaying(true);
//             setCurrentTitle(audioUrl.title);
//             setCurrentImage(audioUrl.imageUrl);
//             setCurrentArtist(audioUrl.artist);
//             setErrorMessage('');
//             startRotation();
//         };
//
//         return () => {
//             // Stop playback and rotation on unmount or song change
//             musicService.stop();
//             stopRotation();
//         };
//     }, [audioUrl]);
//
//     const handlePlayPause = () => {
//         if (isPlaying) {
//             musicService.pause();
//             stopRotation();
//         } else {
//             musicService.play(audioUrl);
//             startRotation();
//         }
//         setIsPlaying(!isPlaying);
//     };
//
//     const handleNext = async () => {
//         const nextSong = await musicService.playNext();
//         if (nextSong) {
//             setCurrentTitle(nextSong.title);
//             setCurrentImage(nextSong.image);
//             setCurrentArtist(nextSong.artist);
//             startRotation();
//         }
//     };
//
//     const handlePrevious = async () => {
//         const prevSong = await musicService.playPrevious();
//         if (prevSong) {
//             setCurrentTitle(prevSong.title);
//             setCurrentImage(prevSong.image);
//             setCurrentArtist(prevSong.artist);
//             startRotation();
//         }
//     };
//
//     const startRotation = () => {
//         rotationLoop.current?.start();
//     };
//
//     const stopRotation = () => {
//         rotationLoop.current?.stop();
//     };
//
//     const rotationInterpolation = rotation.current.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg'],
//     });
//
//     useEffect(() => {
//         rotationLoop.current = Animated.loop(
//             Animated.timing(rotation.current, {
//                 toValue: 1,
//                 duration: 4000,
//                 useNativeDriver: true,
//                 easing: Easing.linear,
//             })
//         );
//     }, []);
//
//     return (
//         <View style={styles.container}>
//             {errorMessage ? (
//                 <Text style={styles.errorText}>{errorMessage}</Text>
//             ) : (
//                 <>
//                     <Animated.Image
//                         source={{ uri: currentImage }}
//                         style={[styles.songImage, { transform: [{ rotate: rotationInterpolation }] }]}
//                     />
//                     <Text style={styles.songTitle}>{currentTitle}</Text>
//                     <Text style={styles.songArtist}>{currentArtist}</Text>
//                     <View style={styles.controls}>
//                         <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
//                             <Icon name="backward" size={30} color="#FFA500" />
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
//                             <Icon name={isPlaying ? "pause" : "play"} size={40} color="#fff" />
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
//                             <Icon name="forward" size={30} color="#FFA500" />
//                         </TouchableOpacity>
//                     </View>
//                 </>
//             )}
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#121212',
//         padding: 20
//     },
//     songImage: {
//         width: 250,
//         height: 250,
//         borderRadius: 125, // Makes the image circular
//         marginBottom: 20,
//         borderWidth: 2,
//         borderColor: '#FFA500',
//         shadowColor: '#000',
//         shadowOpacity: 0.3,
//         shadowRadius: 10,
//         shadowOffset: { width: 0, height: 4 }
//     },
//     songTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#FFA500',
//         marginBottom: 10
//     },
//     songArtist: {
//         fontSize: 16,
//         color: '#BBB',
//         marginBottom: 20
//     },
//     controls: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '80%',
//         marginTop: 20
//     },
//     controlButton: {
//         padding: 10,
//     },
//     playPauseButton: {
//         backgroundColor: '#FFA500',
//         padding: 15,
//         borderRadius: 50,
//         shadowColor: '#000',
//         shadowOpacity: 0.3,
//         shadowRadius: 10,
//         shadowOffset: { width: 0, height: 4 },
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     errorText: {
//         color: 'red',
//         fontSize: 18,
//         textAlign: 'center',
//         marginBottom: 20
//     },
// });
//
// export default MusicPlayer;

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import musicService, { seekTo, getCurrentPosition, getDuration, startPositionTracking} from '../services/MusicService';
import { Easing } from 'react-native';
import Slider from '@react-native-community/slider';

//get time bar for each song


const MusicPlayer = ({ navigation }) => {
    const route = useRoute();
    const { title, audioUrl, imageUrl, artist } = route.params;

    const [sound, setSound] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTitle, setCurrentTitle] = useState(title);
    const [currentImage, setCurrentImage] = useState(imageUrl);
    const [currentArtist, setCurrentArtist] = useState(artist);
    const [isPlaying, setIsPlaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const rotation = useRef(new Animated.Value(0));
    const rotationLoop = useRef(null);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };


    useEffect(() => {
        // Initialize and play new audio if valid URL
        const initializeAudio = async () => {
            try {
                musicService.stop(); // Stop any currently playing song
                await musicService.play(audioUrl); // Play the new song
                setIsPlaying(true); // Mark as playing
                setCurrentTitle(title); // Update title
                setCurrentImage(imageUrl); // Update image
                setCurrentArtist(artist); // Update artist
                setErrorMessage(''); // Clear any previous errors
                startRotation(); // Start rotation animation
            } catch (error) {
                setErrorMessage('Error playing song.');
                console.error(error);
            }
        };

        initializeAudio();

        // Clean up on unmount or song change
        return () => {
            musicService.stop();
            stopRotation();
        };
    }, [audioUrl, title, imageUrl, artist]); // This effect depends on song info

    const handlePlayPause = () => {
        if (isPlaying) {
            musicService.pause();
            stopRotation();
        } else {
            musicService.play(audioUrl);
            startRotation();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = async () => {
        const nextSong = await musicService.playNext();
        if (nextSong) {
            setCurrentTitle(nextSong.title);
            setCurrentImage(nextSong.image);
            setCurrentArtist(nextSong.artist);
            startRotation();
        }
    };

    const handlePrevious = async () => {
        const prevSong = await musicService.playPrevious();
        if (prevSong) {
            setCurrentTitle(prevSong.title);
            setCurrentImage(prevSong.image);
            setCurrentArtist(prevSong.artist);
            startRotation();
        }
    };

    const startRotation = () => {
        rotationLoop.current?.start();
    };

    const stopRotation = () => {
        rotationLoop.current?.stop();
    };

    const rotationInterpolation = rotation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    useEffect(() => {
        rotationLoop.current = Animated.loop(
            Animated.timing(rotation.current, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        );
    }, []);
    useEffect(() => {
        // Start tracking song position
        const interval = startPositionTracking((position, totalDuration) => {
            setCurrentPosition(position);
            setDuration(totalDuration);
        });

        // Cleanup tracking interval on component unmount
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : (
                <>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={25} color="#FFA500" />
                    </TouchableOpacity>
                    <Animated.Image
                        source={{ uri: currentImage }}
                        style={[styles.songImage, { transform: [{ rotate: rotationInterpolation }] }]}
                    />
                    <Text style={styles.songTitle}>{currentTitle}</Text>
                    <Text style={styles.songArtist}>{currentArtist}</Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={currentPosition}
                            onValueChange={setCurrentPosition}
                            onSlidingComplete={(value) => musicService.setCurrentTime(value)} // Update audio position on sliding
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            thumbTintColor="#FFFFFF"
                        />
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
                            <Icon name="backward" size={30} color="#FFA500" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
                            <Icon name={isPlaying ? "pause" : "play"} size={40} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
                            <Icon name="forward" size={30} color="#FFA500" />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        padding: 20
    },

    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginTop: 10,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    timeText: {
        color: '#FFF',
        fontSize: 12,
    },

    backButton: {
        position: 'absolute',
        top: 20,
        left: 20
    },
    songImage: {
        width: 250,
        height: 250,
        borderRadius: 125, // Makes the image circular
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FFA500',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }
    },
    songTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFA500',
        marginBottom: 10
    },
    songArtist: {
        fontSize: 16,
        color: '#BBB',
        marginBottom: 20
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20
    },
    controlButton: {
        padding: 10,
    },
    playPauseButton: {
        backgroundColor: '#FFA500',
        padding: 15,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20
    },
});

export default MusicPlayer;
