import React, {useEffect, useState, useRef} from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Button,
    Image,
    PanResponder
} from 'react-native';
import {FIREBASE_STORAGE, FIREBASE_AUTH} from "../../../FirebaseConfig";
import {ref, listAll, getDownloadURL} from "firebase/storage";
import {signOut} from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import MusicService from '../services/MusicService';

const List = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [songs, setSongs] = useState([]);
    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const draggedImageRef = useRef(null);

    useEffect(() => {
        const fetchSongs = async () => {
            const storageRef = ref(FIREBASE_STORAGE, 'Music');
            try {
                const result = await listAll(storageRef);
                const songPromises = result.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    let title = itemRef.name.split('.')[0];
                    //remove whitespace around the title
                    title = title.trim();

                    // Map authors to specific titles
                    const authors = {
                        "See You Again": "Son Tung",
                        "Another Song Title": "Another Author",
                        // Add more titles and authors as needed
                    };
                    console.log(authors[title]);

                    return {
                        title,
                        url,
                        author: authors[title] || "HIEUTHUHAI", // Use mapped author or default to "HIEUTHUHAI"
                    };
                });
                const songsData = await Promise.all(songPromises);
                setSongs(songsData);
                MusicService.initializeQueue(songsData);
            } catch (error) {
                console.error('Error fetching songs from Firebase Storage:', error);
            }
        };

        const fetchImages = async () => {
            const imagesRef = ref(FIREBASE_STORAGE, 'Images');
            try {
                const result = await listAll(imagesRef);
                const imagePromises = result.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return {
                        title: itemRef.name.split('.')[0],
                        url,
                    };
                });
                const imagesData = await Promise.all(imagePromises);
                setImages(imagesData);
            } catch (error) {
                console.error('Error fetching images from Firebase Storage:', error);
            }
        };

        fetchSongs();
        fetchImages();
    }, []);

    const handleSongPress = (songTitle, audioUrl) => {
        navigation.navigate('MusicPlayer', {title: songTitle, audioUrl});
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
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };

    const getImageForSong = (songTitle) => {
        const normalizedSongTitle = normalizeString(songTitle);
        let bestMatch = null;
        let maxMatchingChars = 0;

        images.forEach(image => {
            const normalizedImageTitle = normalizeString(image.title);
            let matchingChars = 0;

            for (let i = 0; i < Math.min(normalizedSongTitle.length, normalizedImageTitle.length); i++) {
                if (normalizedSongTitle[i] === normalizedImageTitle[i]) {
                    matchingChars++;
                } else {
                    break;
                }
            }

            if (matchingChars > maxMatchingChars) {
                maxMatchingChars = matchingChars;
                bestMatch = image;
            }
        });

        return bestMatch ? bestMatch.url : null;
    };

    const filteredSongs = songs.filter(song =>
        normalizeString(song.title).includes(normalizeString(searchQuery)) ||
        normalizeString(song.author).includes(normalizeString(searchQuery))
    );

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                const {pageX, pageY} = gestureState;
                const image = evt.nativeEvent.target;
                draggedImageRef.current = {image, pageX, pageY};
            },
            onPanResponderMove: (evt, gestureState) => {
                const {moveX, moveY} = gestureState;
                if (draggedImageRef.current) {
                    draggedImageRef.current.pageX = moveX;
                    draggedImageRef.current.pageY = moveY;
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const {moveX, moveY} = gestureState;
                navigation.navigate('MusicPlayer', {
                    title: draggedImageRef.current.image.title,
                    audioUrl: draggedImageRef.current.image.url,
                    draggedImage: draggedImageRef.current.image.url
                });
                draggedImageRef.current = null;
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search music or author"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
                    <Icon2 name="menu" size={25} color="gray"/>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Button title="Close" onPress={() => setModalVisible(false)}/>
                        <Button title="Log Out" onPress={handleLogOut}/>
                    </View>
                </View>
            </Modal>

            <ScrollView style={styles.songList}>
                {filteredSongs.map((song, index) => {
                    const imageUrl = getImageForSong(song.title);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.songItem}
                            onPress={() => handleSongPress(song.title, song.url)}
                            {...panResponder.panHandlers}
                        >
                            <View style={styles.songDetails}>
                                {imageUrl && <Image source={{uri: imageUrl}} style={styles.songImage}/>}
                                <View>
                                    <Text style={styles.songTitle}>{song.title}</Text>
                                    <Text style={styles.songAuthor}>{song.author}</Text>
                                </View>
                            </View>
                            <Icon name="play-circle" size={25} color="#FFA500"/>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Darker background for a sleek look
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#1E1E1E', // Darker shade for search bar background
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#FFA500', // Orange separator
    },
    searchInput: {
        flex: 1,
        height: 45,
        borderRadius: 25,
        paddingHorizontal: 15,
        backgroundColor: 'gray',
        color: '#fff', // Orange text
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Adds a subtle shadow for depth
        fontWeight: '800',
    },
    menuButton: {
        marginLeft: 10,
    },
    songList: {
        flex: 1,
        padding: 15,
    },
    songItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 15,
        backgroundColor: '#1A1A1A', // Dark background for song item
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4, // Adds shadow for depth
    },
    songDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
        borderColor: '#FFA500', // Orange border
        borderWidth: 2,
    },
    songTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFA500', // Orange for title
    },
    songAuthor: {
        fontSize: 12,
        color: '#BBB', // Softer gray for author
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for modal
    },
    modalContent: {
        width: '80%',
        padding: 25,
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        alignItems: 'center',
        borderColor: '#FFA500',
        borderWidth: 1,
    },
    modalButton: {
        marginTop: 15,
        width: '90%',
        paddingVertical: 12,
        backgroundColor: '#FFA500',
        borderRadius: 25,
    },
    modalButtonText: {
        color: '#121212', // Dark text on orange button
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
    },
    menuButtonIcon: {
        color: '#FFA500', // Matches the orange theme
    },
});


export default List;
