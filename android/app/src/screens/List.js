// // import React, {useEffect, useState, useRef} from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image,
// //     PanResponder
// // } from 'react-native';
// // import {FIREBASE_STORAGE, FIREBASE_AUTH} from "../../../FirebaseConfig";
// // import {ref, listAll, getDownloadURL} from "firebase/storage";
// // import {signOut} from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import MusicService from '../services/MusicService';
// //
// // const List = ({navigation}) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [images, setImages] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //
// //     const draggedImageRef = useRef(null);
// //
// //     useEffect(() => {
// //         const fetchSongs = async () => {
// //             const storageRef = ref(FIREBASE_STORAGE, 'Music');
// //             try {
// //                 const result = await listAll(storageRef);
// //                 const songPromises = result.items.map(async (itemRef) => {
// //                     const url = await getDownloadURL(itemRef);
// //                     let title = itemRef.name.split('.')[0];
// //                     //remove whitespace around the title
// //                     title = title.trim();
// //
// //                     // Map authors to specific titles
// //                     const authors = {
// //                         "See You Again": "Son Tung",
// //                         "Another Song Title": "Another Author",
// //                         // Add more titles and authors as needed
// //                     };
// //                     console.log(authors[title]);
// //
// //                     return {
// //                         title,
// //                         url,
// //                         author: authors[title] || "HIEUTHUHAI", // Use mapped author or default to "HIEUTHUHAI"
// //                     };
// //                 });
// //                 const songsData = await Promise.all(songPromises);
// //                 setSongs(songsData);
// //                 MusicService.initializeQueue(songsData);
// //             } catch (error) {
// //                 console.error('Error fetching songs from Firebase Storage:', error);
// //             }
// //         };
// //
// //         const fetchImages = async () => {
// //             const imagesRef = ref(FIREBASE_STORAGE, 'Images');
// //             try {
// //                 const result = await listAll(imagesRef);
// //                 const imagePromises = result.items.map(async (itemRef) => {
// //                     const url = await getDownloadURL(itemRef);
// //                     return {
// //                         title: itemRef.name.split('.')[0],
// //                         url,
// //                     };
// //                 });
// //                 const imagesData = await Promise.all(imagePromises);
// //                 setImages(imagesData);
// //             } catch (error) {
// //                 console.error('Error fetching images from Firebase Storage:', error);
// //             }
// //         };
// //
// //         fetchSongs();
// //         fetchImages();
// //     }, []);
// //
// //     const handleSongPress = (songTitle, audioUrl) => {
// //         navigation.navigate('MusicPlayer', {title: songTitle, audioUrl});
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
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
// //         images.forEach(image => {
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
// //     const filteredSongs = songs.filter(song =>
// //         normalizeString(song.title).includes(normalizeString(searchQuery)) ||
// //         normalizeString(song.author).includes(normalizeString(searchQuery))
// //     );
// //
// //     const panResponder = useRef(
// //         PanResponder.create({
// //             onStartShouldSetPanResponder: () => true,
// //             onPanResponderGrant: (evt, gestureState) => {
// //                 const {pageX, pageY} = gestureState;
// //                 const image = evt.nativeEvent.target;
// //                 draggedImageRef.current = {image, pageX, pageY};
// //             },
// //             onPanResponderMove: (evt, gestureState) => {
// //                 const {moveX, moveY} = gestureState;
// //                 if (draggedImageRef.current) {
// //                     draggedImageRef.current.pageX = moveX;
// //                     draggedImageRef.current.pageY = moveY;
// //                 }
// //             },
// //             onPanResponderRelease: (evt, gestureState) => {
// //                 const {moveX, moveY} = gestureState;
// //                 navigation.navigate('MusicPlayer', {
// //                     title: draggedImageRef.current.image.title,
// //                     audioUrl: draggedImageRef.current.image.url,
// //                     draggedImage: draggedImageRef.current.image.url
// //                 });
// //                 draggedImageRef.current = null;
// //             },
// //         })
// //     ).current;
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or author"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray"/>
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)}/>
// //                         <Button title="Log Out" onPress={handleLogOut}/>
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {filteredSongs.map((song, index) => {
// //                     const imageUrl = getImageForSong(song.title);
// //                     return (
// //                         <TouchableOpacity
// //                             key={index}
// //                             style={styles.songItem}
// //                             onPress={() => handleSongPress(song.title, song.url)}
// //                             {...panResponder.panHandlers}
// //                         >
// //                             <View style={styles.songDetails}>
// //                                 {imageUrl && <Image source={{uri: imageUrl}} style={styles.songImage}/>}
// //                                 <View>
// //                                     <Text style={styles.songTitle}>{song.title}</Text>
// //                                     <Text style={styles.songAuthor}>{song.author}</Text>
// //                                 </View>
// //                             </View>
// //                             <Icon name="play-circle" size={25} color="#FFA500"/>
// //                         </TouchableOpacity>
// //                     );
// //                 })}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212', // Darker background for a sleek look
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E', // Darker shade for search bar background
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500', // Orange separator
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff', // Orange text
// //         shadowColor: "#000",
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.8,
// //         shadowRadius: 2,
// //         elevation: 5, // Adds a subtle shadow for depth
// //         fontWeight: '800',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A', // Dark background for song item
// //         shadowColor: "#000",
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.8,
// //         shadowRadius: 2,
// //         elevation: 4, // Adds shadow for depth
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500', // Orange border
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500', // Orange for title
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB', // Softer gray for author
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for modal
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// //     modalButton: {
// //         marginTop: 15,
// //         width: '90%',
// //         paddingVertical: 12,
// //         backgroundColor: '#FFA500',
// //         borderRadius: 25,
// //     },
// //     modalButtonText: {
// //         color: '#121212', // Dark text on orange button
// //         fontWeight: '600',
// //         textAlign: 'center',
// //         fontSize: 16,
// //     },
// //     menuButtonIcon: {
// //         color: '#FFA500', // Matches the orange theme
// //     },
// // });
// //
// //
// // export default List;
//
// //
// // import React, { useEffect, useState, useRef } from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image,
// //     PanResponder
// // } from 'react-native';
// // import { FIREBASE_STORAGE, FIREBASE_AUTH } from "../../../FirebaseConfig";
// // import { ref, listAll, getDownloadURL } from "firebase/storage";
// // import { signOut } from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import MusicService from '../services/MusicService';
// //
// // const List = ({ navigation }) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const draggedImageRef = useRef(null);
// //
// //     const MusicModel = {
// //         id: '',
// //         title: '',
// //         artist: '',
// //         image: '',
// //         publishedDate: '',
// //         view: 0,
// //         like: 0,
// //         mp3: ''
// //     };
// //
// //     useEffect(() => {
// //         const fetchSongs = async () => {
// //             try {
// //                 const musicFolderRef = ref(FIREBASE_STORAGE, 'Music/');
// //                 const songFolders = await listAll(musicFolderRef);
// //
// //                 const songPromises = songFolders.prefixes.map(async (folderRef) => {
// //                     const songId = folderRef.name; // Folder name as song ID
// //                     const songData = { ...MusicModel, id: songId };
// //                     const files = await listAll(folderRef);
// //
// //                     for (const item of files.items) {
// //                         const url = await getDownloadURL(item);
// //                         if (item.name.endsWith('.mp3')) {
// //                             songData.mp3 = url;
// //                             songData.title = item.name.replace('.mp3', ''); // Set title from MP3 file name
// //                         } else if (item.name.endsWith('.jpg') || item.name.endsWith('.jpeg') || item.name.endsWith('.png')) {
// //                             songData.image = url;
// //                             songData.artist = item.name.replace(/\.(jpg|jpeg|png)$/, ''); // Set artist from image file name
// //                         }
// //                     }
// //
// //                     console.log(`Fetched song: ${JSON.stringify(songData)}`); // Debugging log
// //                     return songData;
// //                 });
// //
// //                 const songsData = await Promise.all(songPromises);
// //                 setSongs(songsData);
// //                 MusicService.initializeQueue(songsData);
// //             } catch (error) {
// //                 console.error('Error fetching songs from Firebase Storage:', error);
// //             }
// //         };
// //
// //         fetchSongs();
// //     }, []);
// //
// //     const handleSongPress = (song) => {
// //         navigation.navigate('MusicPlayer', {
// //             title: song.title,
// //             audioUrl: song.mp3,
// //             imageUrl: song.image,
// //             artist: song.artist
// //         });
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
// //
// //     const normalizeString = (str) => {
// //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //     const filteredSongs = songs.filter(song =>
// //         normalizeString(song.title).includes(normalizeString(searchQuery)) ||
// //         normalizeString(song.artist).includes(normalizeString(searchQuery))
// //     );
// //
// //     const panResponder = useRef(
// //         PanResponder.create({
// //             onStartShouldSetPanResponder: () => true,
// //             onPanResponderGrant: (evt, gestureState) => {
// //                 const { pageX, pageY } = gestureState;
// //                 const image = evt.nativeEvent.target;
// //                 draggedImageRef.current = { image, pageX, pageY };
// //             },
// //             onPanResponderMove: (evt, gestureState) => {
// //                 const { moveX, moveY } = gestureState;
// //                 if (draggedImageRef.current) {
// //                     draggedImageRef.current.pageX = moveX;
// //                     draggedImageRef.current.pageY = moveY;
// //                 }
// //             },
// //             onPanResponderRelease: () => {
// //                 const draggedSong = songs.find(song => song.image === draggedImageRef.current.image);
// //                 if (draggedSong) {
// //                     navigation.navigate('MusicPlayer', {
// //                         title: draggedSong.title,
// //                         audioUrl: draggedSong.mp3,
// //                         imageUrl: draggedSong.image
// //                     });
// //                 }
// //                 draggedImageRef.current = null;
// //             },
// //         })
// //     ).current;
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or artist"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)} />
// //                         <Button title="Log Out" onPress={handleLogOut} />
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {filteredSongs.map((song, index) => (
// //                     <TouchableOpacity
// //                         key={index}
// //                         style={styles.songItem}
// //                         onPress={() => handleSongPress(song)}
// //                         {...panResponder.panHandlers}
// //                     >
// //                         <View style={styles.songDetails}>
// //                             {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
// //                             <View>
// //                                 <Text style={styles.songTitle}>{song.title}</Text>
// //                                 <Text style={styles.songAuthor}>{song.artist}</Text>
// //                             </View>
// //                         </View>
// //                         <Icon name="play-circle" size={25} color="#FFA500" />
// //                     </TouchableOpacity>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212',
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E',
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500',
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff',
// //         shadowColor: "#000",
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.8,
// //         shadowRadius: 2,
// //         elevation: 5,
// //         fontWeight: '800',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A',
// //         shadowColor: "#000",
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.8,
// //         shadowRadius: 2,
// //         elevation: 4,
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500',
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500',
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB',
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// // });
// //
// // // export default List;
// //
// // import React, { useEffect, useState, useRef } from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image,
// //     PanResponder
// // } from 'react-native';
// // import { FIREBASE_STORAGE, FIREBASE_AUTH } from "../../../FirebaseConfig";
// // import { ref, listAll, getDownloadURL } from "firebase/storage";
// // import { signOut } from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import MusicService from '../services/MusicService';
// //
// // const List = ({ navigation }) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const draggedImageRef = useRef(null);
// //
// //     const MusicModel = {
// //         id: '',
// //         title: '',
// //         artist: '',
// //         image: '',
// //         publishedDate: '',
// //         view: 0,
// //         like: 0,
// //         mp3: ''
// //     };
// //
// //     useEffect(() => {
// //         const fetchSongs = async () => {
// //             try {
// //                 const musicFolderRef = ref(FIREBASE_STORAGE, 'Music/');
// //                 const songFolders = await listAll(musicFolderRef);
// //
// //                 const songPromises = songFolders.prefixes.map(async (folderRef) => {
// //                     const songId = folderRef.name;
// //                     const songData = { ...MusicModel, id: songId };
// //                     const files = await listAll(folderRef);
// //
// //                     for (const item of files.items) {
// //                         const url = await getDownloadURL(item);
// //                         if (item.name.endsWith('.mp3')) {
// //                             songData.mp3 = url;
// //                             songData.title = item.name.replace('.mp3', '');
// //                         } else if (item.name.endsWith('.jpg') || item.name.endsWith('.jpeg') || item.name.endsWith('.png')) {
// //                             songData.image = url;
// //                             songData.artist = item.name.replace(/\.(jpg|jpeg|png)$/, '');
// //                         }
// //                     }
// //
// //                     return songData;
// //                 });
// //
// //                 const songsData = await Promise.all(songPromises);
// //                 setSongs(songsData);
// //                 MusicService.initializeQueue(songsData);
// //             } catch (error) {
// //                 console.error('Error fetching songs from Firebase Storage:', error);
// //             }
// //         };
// //
// //         fetchSongs();
// //     }, []);
// //
// //     const handleSongPress = (song) => {
// //         navigation.navigate('MusicPlayer', {
// //             title: song.title,
// //             audioUrl: song.mp3,
// //             imageUrl: song.image,
// //             artist: song.artist
// //         });
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
// //
// //     const normalizeString = (str) => {
// //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //     const filteredSongs = songs.filter(song =>
// //         normalizeString(song.title).includes(normalizeString(searchQuery)) ||
// //         normalizeString(song.artist).includes(normalizeString(searchQuery))
// //     );
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or artist"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)} />
// //                         <Button title="Log Out" onPress={handleLogOut} />
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {filteredSongs.map((song, index) => (
// //                     <TouchableOpacity
// //                         key={index}
// //                         style={styles.songItem}
// //                         onPress={() => handleSongPress(song)}
// //                     >
// //                         <View style={styles.songDetails}>
// //                             {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
// //                             <View>
// //                                 <Text style={styles.songTitle}>{song.title}</Text>
// //                                 <Text style={styles.songAuthor}>{song.artist}</Text>
// //                             </View>
// //                         </View>
// //                         <Icon name="play-circle" size={25} color="#FFA500" />
// //                     </TouchableOpacity>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212',
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E',
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500',
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A',
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500',
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500',
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB',
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// // });
// //
// // // export default List;
// // import React, { useEffect, useState, useRef } from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image
// // } from 'react-native';
// // import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// // import { signOut } from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import MusicService from '../services/MusicService';
// // import { fetchCollectionData } from '../services/FirebaseMusicService';
// //
// // const List = ({ navigation }) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //
// //     useEffect(() => {
// //         const fetchSongs = async () => {
// //             try {
// //                 // Fetch songs data from FirebaseDataService
// //                 const songsData = await fetchCollectionData();
// //                 setSongs(songsData);
// //                 MusicService.initializeQueue(songsData);
// //             } catch (error) {
// //                 console.error('Error fetching songs from Firebase:', error);
// //             }
// //         };
// //
// //         fetchSongs();
// //     }, []);
// //
// //     const handleSongPress = (song) => {
// //         navigation.navigate('MusicPlayer', {
// //             title: song.title,
// //             audioUrl: song.mp3,
// //             imageUrl: song.image,
// //             artist: song.artist
// //         });
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
// //
// //     const normalizeString = (str) => {
// //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //     const filteredSongs = songs.filter(song =>
// //         normalizeString(song.title).includes(normalizeString(searchQuery)) ||
// //         normalizeString(song.artist).includes(normalizeString(searchQuery))
// //     );
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or artist"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)} />
// //                         <Button title="Log Out" onPress={handleLogOut} />
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {filteredSongs.map((song, index) => (
// //                     <TouchableOpacity
// //                         key={index}
// //                         style={styles.songItem}
// //                         onPress={() => handleSongPress(song)}
// //                     >
// //                         <View style={styles.songDetails}>
// //                             {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
// //                             <View>
// //                                 <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
// //                                     {song.title}
// //                                 </Text>
// //                                 <Text style={styles.songAuthor} numberOfLines={2} ellipsizeMode="tail">
// //                                     {song.artist}
// //                                 </Text>
// //
// //                             </View>
// //                         </View>
// //                         <Icon name="play-circle" size={25} color="#FFA500" />
// //                     </TouchableOpacity>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212',
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E',
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500',
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A',
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500',
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500',
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB',
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// // });
// //
// // export default List;
// //
// // import React, { useEffect, useState } from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image
// // } from 'react-native';
// // import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// // import { signOut } from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import MusicService from '../services/MusicService';
// // import { fetchCollectionData } from '../services/FirebaseMusicService';
// //
// // const List = ({ navigation }) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //
// //     useEffect(() => {
// //         const fetchSongs = async () => {
// //             try {
// //                 const songsData = await fetchCollectionData();
// //                 setSongs(songsData);
// //                 MusicService.initializeQueue(songsData);
// //             } catch (error) {
// //                 console.error('Error fetching songs from Firebase:', error);
// //             }
// //         };
// //
// //         fetchSongs();
// //     }, []);
// //
// //     const handleSongPress = (song) => {
// //         navigation.navigate('MusicPlayer', {
// //             title: song.title,
// //             audioUrl: song.mp3,
// //             imageUrl: song.image,
// //             artist: song.artist
// //         });
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
// //
// //     const normalizeString = (str) => {
// //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //     const truncateToWords = (text, wordLimit) => {
// //         const words = text.split(' ');
// //         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
// //     };
// //
// //     const filteredSongs = songs.filter(song =>
// //         normalizeString(song.title).includes(normalizeString(searchQuery)) ||
// //         normalizeString(song.artist).includes(normalizeString(searchQuery))
// //     );
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or artist"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)} />
// //                         <Button title="Log Out" onPress={handleLogOut} />
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {filteredSongs.map((song, index) => (
// //                     <TouchableOpacity
// //                         key={index}
// //                         style={styles.songItem}
// //                         onPress={() => handleSongPress(song)}
// //                     >
// //                         <View style={styles.songDetails}>
// //                             {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
// //                             <View>
// //                                 <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
// //                                     {truncateToWords(song.title, 5)}
// //                                 </Text>
// //                                 <Text style={styles.songAuthor} numberOfLines={2} ellipsizeMode="tail">
// //                                     {truncateToWords(song.artist, 6)}
// //                                 </Text>
// //                             </View>
// //                         </View>
// //                         <Icon name="play-circle" size={25} color="#FFA500" />
// //                     </TouchableOpacity>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212',
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E',
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500',
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A',
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500',
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500',
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB',
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// // });
// //
// // export default List; //nop
// //
// // import React, { useEffect, useState } from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image
// // } from 'react-native';
// // import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// // import { signOut } from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import MusicService from '../services/MusicService';
// // import { fetchCollectionData } from '../services/FirebaseMusicService';
// //
// // const List = ({ navigation }) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //
// //     useEffect(() => {
// //         const fetchSongs = async () => {
// //             try {
// //                 const songsData = await fetchCollectionData();
// //                 setSongs(songsData);
// //                 MusicService.initializeQueue(songsData);
// //             } catch (error) {
// //                 console.error('Error fetching songs from Firebase:', error);
// //             }
// //         };
// //
// //         fetchSongs();
// //     }, []);
// //
// //     const handleSongPress = (song) => {
// //         navigation.navigate('MusicPlayer', {
// //             title: song.title,
// //             audioUrl: song.mp3,
// //             imageUrl: song.image,
// //             artist: song.artist
// //         });
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
// //
// //     const normalizeString = (str) => {
// //         return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //
// //     const truncateToWords = (text, wordLimit) => {
// //         const words = text.split(' ');
// //         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
// //     };
// //
// //     const filteredSongs = songs.filter(song => {
// //         const title = song.title || '';
// //         const artist = song.artist || '';
// //         return normalizeString(title).includes(normalizeString(searchQuery)) ||
// //             normalizeString(artist).includes(normalizeString(searchQuery));
// //     });
// //
// //
// //     // Group songs by category
// //     const groupedSongs = filteredSongs.reduce((acc, song) => {
// //         const category = song.category || 'Other'; // Default to 'Other' if no category is defined
// //         if (!acc[category]) {
// //             acc[category] = [];
// //         }
// //         acc[category].push(song);
// //         return acc;
// //     }, {});
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or artist"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)} />
// //                         <Button title="Log Out" onPress={handleLogOut} />
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {Object.keys(groupedSongs).map((category, index) => (
// //                     <View key={index}>
// //                         <Text style={styles.categoryTitle}>{category}</Text>
// //                         {groupedSongs[category].map((song, songIndex) => (
// //                             <TouchableOpacity
// //                                 key={songIndex}
// //                                 style={styles.songItem}
// //                                 onPress={() => handleSongPress(song)}
// //                             >
// //                                 <View style={styles.songDetails}>
// //                                     {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
// //                                     <View>
// //                                         <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
// //                                             {truncateToWords(song.title, 5)}
// //                                         </Text>
// //                                         <Text style={styles.songAuthor} numberOfLines={2} ellipsizeMode="tail">
// //                                             {truncateToWords(song.artist, 6)}
// //                                         </Text>
// //                                     </View>
// //                                 </View>
// //                                 <Icon name="play-circle" size={25} color="#FFA500" />
// //                             </TouchableOpacity>
// //                         ))}
// //                     </View>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212',
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E',
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500',
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A',
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500',
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500',
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB',
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// //     categoryTitle: {
// //         fontSize: 20,
// //         fontWeight: '700',
// //         color: '#FFA500',
// //         marginVertical: 10,
// //     }
// // });
// //
// // export default List;
// // //
// // import React, { useEffect, useState } from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image
// // } from 'react-native';
// // import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// // import { signOut } from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import MusicService from '../services/MusicService';
// // import { fetchCollectionData } from '../services/FirebaseMusicService';
// //
// // const List = ({ navigation }) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //
// //     useEffect(() => {
// //         const fetchSongs = async () => {
// //             try {
// //                 const songsData = await fetchCollectionData();
// //                 setSongs(songsData);
// //                 MusicService.initializeQueue(songsData);
// //             } catch (error) {
// //                 console.error('Error fetching songs from Firebase:', error);
// //             }
// //         };
// //
// //         fetchSongs();
// //     }, []);
// //
// //     const handleSongPress = (song) => {
// //         navigation.navigate('MusicPlayer', {
// //             title: song.title,
// //             audioUrl: song.mp3,
// //             imageUrl: song.image,
// //             artist: song.artist
// //         });
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
// //
// //     // Helper function to safely normalize and handle undefined/null values
// //     const normalizeString = (str) => {
// //         if (typeof str !== 'string') return ''; // Ensure str is always a string
// //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //     // Helper function to truncate text if it exceeds word limit
// //     const truncateToWords = (text, wordLimit) => {
// //         const words = text.split(' ');
// //         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
// //     };
// //
// //     const filteredSongs = songs.filter(song => {
// //         const title = song.title || '';  // Ensure title is not undefined or null
// //         const artist = song.artist || '';  // Ensure artist is not undefined or null
// //         return normalizeString(title).includes(normalizeString(searchQuery)) ||
// //             normalizeString(artist).includes(normalizeString(searchQuery));
// //     });
// //
// //     // Group songs by category
// //     const groupedSongs = filteredSongs.reduce((acc, song) => {
// //         const category = song.category || 'Other'; // Default to 'Other' if no category is defined
// //         if (!acc[category]) {
// //             acc[category] = [];
// //         }
// //         acc[category].push(song);
// //         return acc;
// //     }, {});
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or artist"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)} />
// //                         <Button title="Log Out" onPress={handleLogOut} />
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {Object.keys(groupedSongs).map((category, index) => (
// //                     <View key={index}>
// //                         <Text style={styles.categoryTitle}>{category}</Text>
// //                         {groupedSongs[category].map((song, songIndex) => (
// //                             <TouchableOpacity
// //                                 key={songIndex}
// //                                 style={styles.songItem}
// //                                 onPress={() => handleSongPress(song)}
// //                             >
// //                                 <View style={styles.songDetails}>
// //                                     {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
// //                                     <View>
// //                                         <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
// //                                             {truncateToWords(song.title || 'Untitled Song', 5)}  {/* Ensure title is not undefined */}
// //                                         </Text>
// //                                         <Text style={styles.songAuthor} numberOfLines={2} ellipsizeMode="tail">
// //                                             {truncateToWords(song.artist || 'Unknown Artist', 6)}  {/* Ensure artist is not undefined */}
// //                                         </Text>
// //                                     </View>
// //                                 </View>
// //                                 <Icon name="play-circle" size={25} color="#FFA500" />
// //                             </TouchableOpacity>
// //                         ))}
// //                     </View>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212',
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E',
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500',
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A',
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500',
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500',
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB',
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// //     categoryTitle: {
// //         fontSize: 20,
// //         fontWeight: '700',
// //         color: '#FFA500',
// //         marginVertical: 10,
// //     }
// // });
// //
// // // export default List;
// // import React, { useEffect, useState } from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image
// // } from 'react-native';
// // import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// // import { signOut } from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import MusicService from '../services/MusicService';
// //
// // const List = ({ navigation }) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //
// //     useEffect(() => {
// //         // Retrieve data from the queue in MusicService instead of fetching from Firebase
// //         const songsData = MusicService.getQueue();
// //         console.log(songsData); // Check if songsData has the song list
// //         setSongs(songsData);
// //     }, []);
// //
// //     const handleSongPress = (song) => {
// //         navigation.navigate('MusicPlayer', {
// //             title: song.title,
// //             audioUrl: song.mp3,
// //             imageUrl: song.image,
// //             artist: song.artist
// //         });
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
// //
// //     const normalizeString = (str) => {
// //         if (typeof str !== 'string') return '';
// //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //     const truncateToWords = (text, wordLimit) => {
// //         const words = text.split(' ');
// //         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
// //     };
// //
// //     const filteredSongs = songs.filter(song => {
// //         const title = song.title || '';
// //         const artist = song.artist || '';
// //         return normalizeString(title).includes(normalizeString(searchQuery)) ||
// //             normalizeString(artist).includes(normalizeString(searchQuery));
// //     });
// //
// //     const groupedSongs = filteredSongs.reduce((acc, song) => {
// //         const category = song.category || 'Other';
// //         if (!acc[category]) {
// //             acc[category] = [];
// //         }
// //         acc[category].push(song);
// //         return acc;
// //     }, {});
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or artist"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)} />
// //                         <Button title="Log Out" onPress={handleLogOut} />
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {Object.keys(groupedSongs).map((category, index) => (
// //                     <View key={index}>
// //                         <Text style={styles.categoryTitle}>{category}</Text>
// //                         {groupedSongs[category].map((song, songIndex) => (
// //                             <TouchableOpacity
// //                                 key={songIndex}
// //                                 style={styles.songItem}
// //                                 onPress={() => handleSongPress(song)}
// //                             >
// //                                 <View style={styles.songDetails}>
// //                                     {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
// //                                     <View>
// //                                         <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
// //                                             {truncateToWords(song.title || 'Untitled Song', 5)}
// //                                         </Text>
// //                                         <Text style={styles.songAuthor} numberOfLines={2} ellipsizeMode="tail">
// //                                             {truncateToWords(song.artist || 'Unknown Artist', 6)}
// //                                         </Text>
// //                                     </View>
// //                                 </View>
// //                                 <Icon name="play-circle" size={25} color="#FFA500" />
// //                             </TouchableOpacity>
// //                         ))}
// //                     </View>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212',
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E',
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500',
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A',
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500',
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500',
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB',
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// //     categoryTitle: {
// //         fontSize: 20,
// //         fontWeight: '700',
// //         color: '#FFA500',
// //         marginVertical: 10,
// //     }
// // });
// //
// // export default List;
// //
// // import React, { useEffect, useState } from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     ScrollView,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Modal,
// //     Button,
// //     Image
// // } from 'react-native';
// // import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// // import { signOut } from 'firebase/auth';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import Icon2 from 'react-native-vector-icons/MaterialIcons';
// // import { fetchCollectionData, getQueue } from '../services/MusicService';
// //
// // const List = ({ navigation }) => {
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [songs, setSongs] = useState([]);
// //     const [searchQuery, setSearchQuery] = useState('');
// //
// //     useEffect(() => {
// //         const loadData = async () => {
// //             try {
// //                 await fetchCollectionData(); // Fetch data from Firestore
// //                 const songsData = getQueue(); // Retrieve data from queue
// //                 setSongs(songsData);
// //                 console.log("Loaded songs:", songsData);
// //             } catch (error) {
// //                 console.error("Error loading songs:", error);
// //             }
// //         };
// //
// //         loadData();
// //     }, []);
// //
// //     const handleSongPress = (song) => {
// //         navigation.navigate('MusicPlayer', {
// //             title: song.title,
// //             audioUrl: song.mp3,
// //             imageUrl: song.image,
// //             artist: song.artist
// //         });
// //     };
// //
// //     const handleLogOut = async () => {
// //         try {
// //             await signOut(FIREBASE_AUTH);
// //             navigation.replace('SignIn');
// //         } catch (error) {
// //             console.error('Error logging out:', error.message);
// //         }
// //     };
// //
// //     const normalizeString = (str) => {
// //         if (typeof str !== 'string') return '';
// //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// //     };
// //
// //     const truncateToWords = (text, wordLimit) => {
// //         const words = text.split(' ');
// //         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
// //     };
// //
// //     const filteredSongs = songs.filter(song => {
// //         const title = song.title || '';
// //         const artist = song.artist || '';
// //         return normalizeString(title).includes(normalizeString(searchQuery)) ||
// //             normalizeString(artist).includes(normalizeString(searchQuery));
// //     });
// //
// //     const groupedSongs = filteredSongs.reduce((acc, song) => {
// //         const category = song.category || 'Other';
// //         if (!acc[category]) {
// //             acc[category] = [];
// //         }
// //         acc[category].push(song);
// //         return acc;
// //     }, {});
// //
// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search music or artist"
// //                     value={searchQuery}
// //                     onChangeText={setSearchQuery}
// //                 />
// //                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
// //                     <Icon2 name="menu" size={25} color="gray" />
// //                 </TouchableOpacity>
// //             </View>
// //
// //             <Modal
// //                 visible={modalVisible}
// //                 transparent={true}
// //                 animationType="slide"
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <View style={styles.modalContent}>
// //                         <Button title="Close" onPress={() => setModalVisible(false)} />
// //                         <Button title="Log Out" onPress={handleLogOut} />
// //                     </View>
// //                 </View>
// //             </Modal>
// //
// //             <ScrollView style={styles.songList}>
// //                 {Object.keys(groupedSongs).map((category, index) => (
// //                     <View key={index}>
// //                         <Text style={styles.categoryTitle}>{category}</Text>
// //                         {groupedSongs[category].map((song, songIndex) => (
// //                             <TouchableOpacity
// //                                 key={songIndex}
// //                                 style={styles.songItem}
// //                                 onPress={() => handleSongPress(song)}
// //                             >
// //                                 <View style={styles.songDetails}>
// //                                     {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
// //                                     <View>
// //                                         <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
// //                                             {truncateToWords(song.title || 'Untitled Song', 5)}
// //                                         </Text>
// //                                         <Text style={styles.songAuthor} numberOfLines={2} ellipsizeMode="tail">
// //                                             {truncateToWords(song.artist || 'Unknown Artist', 6)}
// //                                         </Text>
// //                                     </View>
// //                                 </View>
// //                                 <Icon name="play-circle" size={25} color="#FFA500" />
// //                             </TouchableOpacity>
// //                         ))}
// //                     </View>
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#121212',
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         padding: 20,
// //         backgroundColor: '#1E1E1E',
// //         alignItems: 'center',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#FFA500',
// //     },
// //     searchInput: {
// //         flex: 1,
// //         height: 45,
// //         borderRadius: 25,
// //         paddingHorizontal: 15,
// //         backgroundColor: 'gray',
// //         color: '#fff',
// //     },
// //     menuButton: {
// //         marginLeft: 10,
// //     },
// //     songList: {
// //         flex: 1,
// //         padding: 15,
// //     },
// //     songItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 20,
// //         paddingHorizontal: 10,
// //         marginVertical: 5,
// //         borderRadius: 15,
// //         backgroundColor: '#1A1A1A',
// //     },
// //     songDetails: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     songImage: {
// //         width: 50,
// //         height: 50,
// //         borderRadius: 10,
// //         marginRight: 15,
// //         borderColor: '#FFA500',
// //         borderWidth: 2,
// //     },
// //     songTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#FFA500',
// //     },
// //     songAuthor: {
// //         fontSize: 12,
// //         color: '#BBB',
// //     },
// //     modalContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     },
// //     modalContent: {
// //         width: '80%',
// //         padding: 25,
// //         backgroundColor: '#1E1E1E',
// //         borderRadius: 15,
// //         alignItems: 'center',
// //         borderColor: '#FFA500',
// //         borderWidth: 1,
// //     },
// //     categoryTitle: {
// //         fontSize: 20,
// //         fontWeight: '700',
// //         color: '#FFA500',
// //         marginVertical: 10,
// //     }
// // });
// //
// // export default List;
//
//
// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Image } from 'react-native';
// import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// import { signOut } from 'firebase/auth';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import { fetchCollectionData, getQueue } from '../services/MusicService';
//
// const List = ({ navigation }) => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [songs, setSongs] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//
//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 await fetchCollectionData(); // Fetch data from Firestore
//                 const songsData = getQueue(); // Retrieve data from queue
//                 setSongs(songsData);
//                 console.log("Loaded songs:", songsData);
//             } catch (error) {
//                 console.error("Error loading songs:", error);
//             }
//         };
//
//         loadData();
//     }, []);
//
//     const handleSongPress = (song) => {
//         navigation.navigate('MusicPlayer', {
//             title: song.title,
//             audioUrl: song.mp3,
//             imageUrl: song.image,
//             artist: song.artist
//         });
//     };
//
//     const handleLogOut = async () => {
//         try {
//             await signOut(FIREBASE_AUTH);
//             navigation.replace('SignIn');
//         } catch (error) {
//             console.error('Error logging out:', error.message);
//         }
//     };
//
//     const normalizeString = (str) => {
//         if (typeof str !== 'string') return '';
//         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
//     };
//
//     const truncateToWords = (text, wordLimit) => {
//         const words = text.split(' ');
//         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
//     };
//
//     const filteredSongs = songs.filter(song => {
//         const title = song.title || '';
//         const artist = song.artist || '';
//         return normalizeString(title).includes(normalizeString(searchQuery)) ||
//             normalizeString(artist).includes(normalizeString(searchQuery));
//     });
//
//     const groupedSongs = filteredSongs.reduce((acc, song) => {
//         const category = song.category || 'Other';
//         if (!acc[category]) {
//             acc[category] = [];
//         }
//         acc[category].push(song);
//         return acc;
//     }, {});
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.searchContainer}>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search music or artist"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
//                     <Icon2 name="menu" size={25} color="gray" />
//                 </TouchableOpacity>
//             </View>
//
//             <Modal
//                 visible={modalVisible}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Button title="Close" onPress={() => setModalVisible(false)} />
//                         <Button title="Log Out" onPress={handleLogOut} />
//                     </View>
//                 </View>
//             </Modal>
//
//             <ScrollView style={styles.songList}>
//                 {Object.keys(groupedSongs).map((category, index) => (
//                     <View key={index}>
//                         <Text style={styles.categoryTitle}>{category}</Text>
//                         {groupedSongs[category].map((song, songIndex) => (
//                             <TouchableOpacity
//                                 key={songIndex}
//                                 style={styles.songItem}
//                                 onPress={() => handleSongPress(song)}
//                             >
//                                 <View style={styles.songDetails}>
//                                     {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
//                                     <View>
//                                         <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
//                                             {truncateToWords(song.title || 'Untitled Song', 5)}
//                                         </Text>
//                                         <Text style={styles.songAuthor} numberOfLines={2} ellipsizeMode="tail">
//                                             {truncateToWords(song.artist || 'Unknown Artist', 6)}
//                                         </Text>
//                                     </View>
//                                 </View>
//                                 <Icon name="play-circle" size={25} color="#FFA500" />
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#121212',
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         padding: 20,
//         backgroundColor: '#1E1E1E',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//         borderBottomColor: '#FFA500',
//     },
//     searchInput: {
//         flex: 1,
//         height: 45,
//         borderRadius: 25,
//         paddingHorizontal: 15,
//         backgroundColor: 'gray',
//         color: '#fff',
//     },
//     menuButton: {
//         marginLeft: 10,
//     },
//     songList: {
//         flex: 1,
//         padding: 15,
//     },
//     songItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 20,
//         paddingHorizontal: 10,
//         marginVertical: 5,
//         borderRadius: 15,
//         backgroundColor: '#1A1A1A',
//     },
//     songDetails: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     songImage: {
//         width: 50,
//         height: 50,
//         borderRadius: 10,
//         marginRight: 15,
//         borderColor: '#FFA500',
//         borderWidth: 2,
//     },
//     songTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#FFA500',
//     },
//     songAuthor: {
//         fontSize: 12,
//         color: '#BBB',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     },
//     modalContent: {
//         width: '80%',
//         padding: 25,
//         backgroundColor: '#1E1E1E',
//         borderRadius: 15,
//         alignItems: 'center',
//         borderColor: '#FFA500',
//     },
//     categoryTitle: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#FFA500',
//         marginVertical: 10,
//     },
// });
//
// export default List;

// // List.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Image } from 'react-native';
// import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// import { signOut } from 'firebase/auth';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import MusicService from '../services/MusicService'; // Import MusicService
//
// const List = ({ navigation }) => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [songs, setSongs] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//
//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 // Fetch data from Firestore and update state
//                 const fetchedSongs = await MusicService.fetchCollectionData();
//                 setSongs(fetchedSongs); // Set the songs data to state
//                 console.log("Loaded songs:", fetchedSongs);
//             } catch (error) {
//                 console.error("Error loading songs:", error);
//             }
//         };
//
//         loadData();
//     }, []);
//
//
//     const handleSongPress = (song) => {
//         // Navigate to the MusicPlayer screen and pass the song details and the entire playlist
//         navigation.navigate('MusicPlayer', {
//             title: song.title,
//             audioUrl: song.mp3,
//             imageUrl: song.image,
//             artist: song.artist,
//             playlist: songs, // Pass the entire songs list
//         });
//     };
//
//
//     const handleLogOut = async () => {
//         try {
//             await signOut(FIREBASE_AUTH);
//             navigation.replace('SignIn');
//         } catch (error) {
//             console.error('Error logging out:', error.message);
//         }
//     };
//
//     const normalizeString = (str) => {
//         if (typeof str !== 'string') return '';
//         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
//     };
//
//     const truncateToWords = (text, wordLimit) => {
//         const words = text.split(' ');
//         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
//     };
//
//     const filteredSongs = songs.filter(song => {
//         const title = song.title || '';
//         const artist = song.artist || '';
//         return normalizeString(title).includes(normalizeString(searchQuery)) ||
//             normalizeString(artist).includes(normalizeString(searchQuery));
//     });
//
//     const groupedSongs = filteredSongs.reduce((acc, song) => {
//         const category = song.category || 'Other';
//         if (!acc[category]) {
//             acc[category] = [];
//         }
//         acc[category].push(song);
//         return acc;
//     }, {});
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.searchContainer}>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search music or artist"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
//                     <Icon2 name="menu" size={25} color="gray" />
//                 </TouchableOpacity>
//             </View>
//
//             <Modal
//                 visible={modalVisible}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Button title="Close" onPress={() => setModalVisible(false)} />
//                         <Button title="Log Out" onPress={handleLogOut} />
//                     </View>
//                 </View>
//             </Modal>
//
//             <ScrollView style={styles.songList}>
//                 {Object.keys(groupedSongs).map((category, index) => (
//                     <View key={index}>
//                         <Text style={styles.categoryTitle}>{category}</Text>
//                         {groupedSongs[category].map((song, songIndex) => (
//                             <TouchableOpacity
//                                 key={songIndex}
//                                 style={styles.songItem}
//                                 onPress={() => handleSongPress(song)}
//                             >
//                                 <View style={styles.songDetails}>
//                                     {song.image && <Image source={{ uri: song.image }} style={styles.songImage} />}
//                                     <View>
//                                         <Text style={styles.songTitle} numberOfLines={2} ellipsizeMode="tail">
//                                             {truncateToWords(song.title || 'Untitled Song', 5)}
//                                         </Text>
//                                         <Text style={styles.songAuthor} numberOfLines={2} ellipsizeMode="tail">
//                                             {truncateToWords(song.artist || 'Unknown Artist', 6)}
//                                         </Text>
//                                     </View>
//                                 </View>
//                                 <Icon name="play-circle" size={25} color="#FFA500" />
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#121212',
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         padding: 20,
//         backgroundColor: '#1E1E1E',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//         borderBottomColor: '#FFA500',
//     },
//     searchInput: {
//         flex: 1,
//         height: 45,
//         borderRadius: 25,
//         paddingHorizontal: 15,
//         backgroundColor: 'gray',
//         color: '#fff',
//     },
//     menuButton: {
//         marginLeft: 10,
//     },
//     songList: {
//         flex: 1,
//         padding: 15,
//     },
//     songItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 20,
//         paddingHorizontal: 10,
//         marginVertical: 5,
//         borderRadius: 15,
//         backgroundColor: '#1A1A1A',
//     },
//     songDetails: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     songImage: {
//         width: 50,
//         height: 50,
//         borderRadius: 10,
//         marginRight: 15,
//         borderColor: '#FFA500',
//         borderWidth: 2,
//     },
//     songTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#FFA500',
//     },
//     songAuthor: {
//         fontSize: 12,
//         color: '#BBB',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     },
//     modalContent: {
//         width: '80%',
//         padding: 25,
//         backgroundColor: '#1E1E1E',
//         borderRadius: 15,
//         alignItems: 'center',
//         borderColor: '#FFA500',
//     },
//     categoryTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#FFA500',
//         marginVertical: 10,
//     }
// });
//
// // export default List;
//
// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Image } from 'react-native';
// import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// import { signOut } from 'firebase/auth';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import MusicService from '../services/MusicService'; // Import MusicService
//
// const List = ({ navigation }) => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [songs, setSongs] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//
//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 // Fetch data from Firestore and update state
//                 const fetchedSongs = await MusicService.fetchCollectionData();
//                 setSongs(fetchedSongs); // Set the songs data to state
//                 console.log("Loaded songs:", fetchedSongs);
//             } catch (error) {
//                 console.error("Error loading songs:", error);
//             }
//         };
//
//         loadData();
//     }, []);
//
//
//     const handleSongPress = (song) => {
//         // Navigate to the MusicPlayer screen and pass the song details and the entire playlist
//         navigation.navigate('MusicPlayer', {
//             title: song.title,
//             audioUrl: song.mp3,
//             imageUrl: song.image,
//             artist: song.artist,
//             playlist: songs, // Pass the entire songs list
//         });
//     };
//
//
//     const handleLogOut = async () => {
//         try {
//             await signOut(FIREBASE_AUTH);
//             navigation.replace('SignIn');
//         } catch (error) {
//             console.error('Error logging out:', error.message);
//         }
//     };
//
//     const normalizeString = (str) => {
//         if (typeof str !== 'string') return '';  // Fallback for invalid `str`
//         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
//     };
//
//
//     const truncateToWords = (text, wordLimit) => {
//         const words = text.split(' ');
//         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
//     };
//
//     const filteredSongs = songs.filter(song => {
//         const title = song.title || '';  // Fallback to empty string if title is undefined
//         const artist = song.artist || '';  // Fallback to empty string if artist is undefined
//         return normalizeString(title).includes(normalizeString(searchQuery)) ||
//             normalizeString(artist).includes(normalizeString(searchQuery));
//     });
//
//     const groupedSongs = filteredSongs.reduce((acc, song) => {
//         const category = song.category || 'Other';
//         if (!acc[category]) {
//             acc[category] = [];
//         }
//         acc[category].push(song);
//         return acc;
//     }, {});
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.searchContainer}>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search music or artist"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
//                     <Icon2 name="menu" size={25} color="gray" />
//                 </TouchableOpacity>
//             </View>
//
//             <Modal
//                 visible={modalVisible}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modal}>
//                     <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//                         <Icon name="times" size={30} color="#FFA500" />
//                     </TouchableOpacity>
//                     <Button title="Log Out" onPress={handleLogOut} />
//                 </View>
//             </Modal>
//
//             <ScrollView style={styles.scrollView}>
//                 {Object.keys(groupedSongs).map(category => (
//                     <View key={category} style={styles.categoryContainer}>
//                         <Text style={styles.categoryTitle}>{category}</Text>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                             {groupedSongs[category].map((song, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     onPress={() => handleSongPress(song)}
//                                     style={styles.songContainer}
//                                 >
//                                     <Image source={{ uri: song.image }} style={styles.songImage} />
//                                     <Text style={styles.songTitle}>{truncateToWords(song.title, 2)}</Text>
//                                     <Text style={styles.songArtist}>{truncateToWords(song.artist, 1)}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>
//                     </View>
//                 ))}
//             </ScrollView>
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
//     searchContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     searchInput: {
//         flex: 1,
//         backgroundColor: '#333',
//         color: '#fff',
//         padding: 10,
//         borderRadius: 5,
//     },
//     menuButton: {
//         padding: 10,
//     },
//     modal: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 20,
//         right: 20,
//     },
//     scrollView: {
//         flex: 1,
//     },
//     categoryContainer: {
//         marginBottom: 20,
//     },
//     categoryTitle: {
//         fontSize: 20,
//         color: '#FFA500',
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     songContainer: {
//         width: 120,
//         marginRight: 15,
//         alignItems: 'center',
//     },
//     songImage: {
//         width: 100,
//         height: 100,
//         borderRadius: 10,
//     },
//     songTitle: {
//         color: '#fff',
//         marginTop: 5,
//         textAlign: 'center',
//     },
//     songArtist: {
//         color: '#aaa',
//         fontSize: 12,
//     },
// });
//
// export default List;
//
//
// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Image } from 'react-native';
// import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// import { signOut } from 'firebase/auth';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import MusicService from '../services/MusicService';
//
// const List = ({ navigation }) => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [songs, setSongs] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//
//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const fetchedSongs = await MusicService.fetchCollectionData();
//                 setSongs(fetchedSongs);
//                 console.log("Loaded songs:", fetchedSongs);
//             } catch (error) {
//                 console.error("Error loading songs:", error);
//             }
//         };
//
//         loadData();
//     }, []);
//
//     const handleSongPress = (song) => {
//         navigation.navigate('MusicPlayer', {
//             title: song.title,
//             audioUrl: song.mp3,
//             imageUrl: song.image,
//             artist: song.artist,
//             playlist: songs,
//         });
//     };
//
//     const handleLogOut = async () => {
//         try {
//             await signOut(FIREBASE_AUTH);
//             navigation.replace('SignIn');
//         } catch (error) {
//             console.error('Error logging out:', error.message);
//         }
//     };
//
//     const normalizeString = (str) => {
//         return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
//     };
//
//     const truncateToWords = (text, wordLimit) => {
//         const words = text.split(' ');
//         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
//     };
//
//     const filteredSongs = songs.filter(song => {
//         const title = song.title || '';
//         const artist = song.artist || '';
//         return normalizeString(title).includes(normalizeString(searchQuery)) ||
//             normalizeString(artist).includes(normalizeString(searchQuery));
//     });
//
//     const groupedSongs = filteredSongs.reduce((acc, song) => {
//         const category = song.category || 'Other';
//         if (!acc[category]) acc[category] = [];
//         acc[category].push(song);
//         return acc;
//     }, {});
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.searchContainer}>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search music or artist"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
//                     <Icon2 name="menu" size={25} color="gray" />
//                 </TouchableOpacity>
//             </View>
//
//             <Modal
//                 visible={modalVisible}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modal}>
//                     <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//                         <Icon name="times" size={30} color="#FFA500" />
//                     </TouchableOpacity>
//                     <Button title="Log Out" onPress={handleLogOut} />
//                 </View>
//             </Modal>
//
//             <ScrollView style={styles.scrollView}>
//                 {Object.keys(groupedSongs).map((category) => (
//                     <View key={category} style={styles.categoryContainer}>
//                         <Text style={styles.categoryTitle}>{category}</Text>
//                         {groupedSongs[category].map((song) => (
//                             <TouchableOpacity key={song.id} style={styles.songContainer} onPress={() => handleSongPress(song)}>
//                                 <Image source={{ uri: song.image }} style={styles.songImage} />
//                                 <View style={styles.songInfo}>
//                                     <Text style={styles.songTitle}>{truncateToWords(song.title, 5)}</Text>
//                                     <Text style={styles.songArtist}>{song.artist}</Text>
//                                 </View>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 10, backgroundColor: '#121212' },
//     searchContainer: { flexDirection: 'row', alignItems: 'center' },
//     searchInput: { flex: 1, backgroundColor: '#1e1e1e', borderRadius: 10, padding: 10, color: 'white' },
//     menuButton: { marginLeft: 10 },
//     modal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
//     closeButton: { position: 'absolute', top: 20, right: 20 },
//     scrollView: { flex: 1 },
//     categoryContainer: { marginBottom: 15 },
//     categoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFA500', marginBottom: 5 },
//     songContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//     songImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
//     songInfo: { flex: 1 },
//     songTitle: { fontSize: 16, color: 'white' },
//     songArtist: { fontSize: 14, color: 'gray' },
// });
//
// export default List;
//
//
// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Image } from 'react-native';
// import { FIREBASE_AUTH } from "../../../FirebaseConfig";
// import { signOut } from 'firebase/auth';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import MusicService from '../services/MusicService';
//
// const List = ({ navigation }) => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [songs, setSongs] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//
//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const fetchedSongs = await MusicService.fetchCollectionData();
//                 setSongs(fetchedSongs);
//                 console.log("Loaded songs:", fetchedSongs);
//             } catch (error) {
//                 console.error("Error loading songs:", error);
//             }
//         };
//
//         loadData();
//     }, []);
//
//     const handleSongPress = (song) => {
//         navigation.navigate('MusicPlayer', {
//             title: song.title,
//             audioUrl: song.mp3,
//             imageUrl: song.image,
//             artist: song.artist,
//             playlist: songs,
//         });
//     };
//
//     const handleLogOut = async () => {
//         try {
//             await signOut(FIREBASE_AUTH);
//             navigation.replace('SignIn');
//         } catch (error) {
//             console.error('Error logging out:', error.message);
//         }
//     };
//
//     const normalizeString = (str) => {
//         return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
//     };
//
//     const truncateToWords = (text, wordLimit) => {
//         const words = text.split(' ');
//         return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
//     };
//
//     const filteredSongs = songs.filter(song => {
//         const title = song.title || '';
//         const artist = song.artist || '';
//         return normalizeString(title).includes(normalizeString(searchQuery)) ||
//             normalizeString(artist).includes(normalizeString(searchQuery));
//     });
//
//     const groupedSongs = filteredSongs.reduce((acc, song) => {
//         const category = song.category || 'Other';
//         if (!acc[category]) acc[category] = [];
//         acc[category].push(song);
//         return acc;
//     }, {});
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.searchContainer}>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search music or artist"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                 />
//                 <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
//                     <Icon2 name="menu" size={25} color="gray" />
//                 </TouchableOpacity>
//             </View>
//
//             <Modal
//                 visible={modalVisible}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modal}>
//                     <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//                         <Icon name="times" size={30} color="#FFA500" />
//                     </TouchableOpacity>
//                     <Button title="Log Out" onPress={handleLogOut} />
//                 </View>
//             </Modal>
//
//             <ScrollView style={styles.scrollView}>
//                 {Object.keys(groupedSongs).map((category) => (
//                     <View key={category} style={styles.categoryContainer}>
//                         <Text style={styles.categoryTitle}>{category}</Text>
//                         {groupedSongs[category].map((song) => (
//                             <TouchableOpacity key={song.id} style={styles.songContainer} onPress={() => handleSongPress(song)}>
//                                 <Image source={{ uri: song.image }} style={styles.songImage} />
//                                 <View style={styles.songInfo}>
//                                     <Text style={styles.songTitle}>{truncateToWords(song.title, 5)}</Text>
//                                     <Text style={styles.songArtist}>{song.artist}</Text>
//                                 </View>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 10, backgroundColor: '#121212' },
//     searchContainer: { flexDirection: 'row', alignItems: 'center' },
//     searchInput: { flex: 1, backgroundColor: '#1e1e1e', borderRadius: 10, padding: 10, color: 'white' },
//     menuButton: { marginLeft: 10 },
//     modal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
//     closeButton: { position: 'absolute', top: 20, right: 20 },
//     scrollView: { flex: 1 },
//     categoryContainer: { marginBottom: 15 },
//     categoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFA500', marginBottom: 5 },
//     songContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//     songImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
//     songInfo: { flex: 1 },
//     songTitle: { fontSize: 16, color: 'white' },
//     songArtist: { fontSize: 14, color: 'gray' },
// });
//
// export default List;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Image } from 'react-native';
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import MusicService from '../services/MusicService';


const List = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedSongs = await MusicService.fetchCollectionData();
                setSongs(fetchedSongs);
                console.log("Loaded songs:", fetchedSongs);
            } catch (error) {
                console.error("Error loading songs:", error);
            }
        };

        loadData();
    }, []);


    const handleSongPress = (song) => {
        MusicService.stop(); // Stop any currently playing song
        MusicService.play(song.mp3);
        navigation.navigate('MusicPlayer', {
            title: song.title,
            audioUrl: song.mp3,
            imageUrl: song.image,
            artist: song.artist,
            playlist: songs, // Pass the entire songs list// Play the selected song
        });

    };


    const handleLogOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            navigation.replace('SignIn');
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    const normalizeString = (str) => {
        return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
    };

    const truncateToWords = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    };

    const filteredSongs = songs.filter(song => {
        const title = song.title || '';
        const artist = song.artist || '';
        return normalizeString(title).includes(normalizeString(searchQuery)) ||
            normalizeString(artist).includes(normalizeString(searchQuery));
    });

    const groupedSongs = filteredSongs.reduce((acc, song) => {
        const category = song.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(song);
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search music or artist"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
                    <Icon2 name="menu" size={25} color="gray" />
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modal}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Icon name="times" size={30} color="#FFA500" />
                    </TouchableOpacity>
                    <Button title="Log Out" onPress={handleLogOut} />
                </View>
            </Modal>

            <ScrollView style={styles.scrollView}>
                {Object.keys(groupedSongs).map((category) => (
                    <View key={category} style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>{category}</Text>
                        {groupedSongs[category].map((song) => (
                            <TouchableOpacity key={song.id} style={styles.songContainer} onPress={() => handleSongPress(song)}>
                                <Image source={{ uri: song.image }} style={styles.songImage} />
                                <View style={styles.songInfo}>
                                    <Text style={styles.songTitle}>{truncateToWords(song.title, 5)}</Text>
                                    <Text style={styles.songArtist}>{song.artist}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    menuButton: {
        marginLeft: 10,
    },
    scrollView: {
        marginTop: 10,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFA500',
        marginBottom: 10,
    },
    songContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    songInfo: {
        marginLeft: 15,
    },
    songTitle: {
        color: '#fff',
        fontSize: 16,
    },
    songArtist: {
        color: '#bbb',
        fontSize: 14,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});

export default List;
