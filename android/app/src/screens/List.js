import { useEffect, useState } from 'react';
import { FIREBASE_STORAGE, FIREBASE_AUTH } from "../../../FirebaseConfig";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

const List = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        // Fetch music list from Firebase Storage
        const fetchSongs = async () => {
            const storageRef = ref(FIREBASE_STORAGE, 'Music'); // Path to the music folder in Firebase Storage
            try {
                const result = await listAll(storageRef); // Get list of music files
                const songPromises = result.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef); // Get file URL
                    return {
                        title: itemRef.name.split('.')[0], // Get the song title (remove file extension)
                        url,
                    };
                });
                const songsData = await Promise.all(songPromises);
                setSongs(songsData);
            } catch (error) {
                console.error('Error fetching songs from Firebase Storage:', error);
            }
        };

        fetchSongs();
    }, []);

    const handleSongPress = (songTitle, audioUrl) => {
        // Navigate to MusicPlayer page and pass song information
        navigation.navigate('MusicPlayer', { title: songTitle, audioUrl });
    };

    const handleLogOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            Alert.alert('Logged out successfully');
            navigation.replace('SignIn'); // Navigate back to the Login screen
        } catch (error) {
            Alert.alert('Error logging out', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search music"
                />
                <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
                    <Icon2 name="menu" size={25} color="#000" />
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
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                        <Button title="Log Out" onPress={handleLogOut} />
                    </View>
                </View>
            </Modal>

            <ScrollView style={styles.songList}>
                {songs.map((song, index) => (
                    <TouchableOpacity key={index} style={styles.songItem} onPress={() => handleSongPress(song.title, song.url)}>
                        <View style={styles.songDetails}>
                            <Text style={styles.songTitle}>{song.title}</Text>
                        </View>
                        <Icon name="play-circle" size={20} color="#000" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 30,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: '#e6e6e6',
    },
    menuButton: {
        marginLeft: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#000',
    },
    songList: {
        flex: 1,
        padding: 10,
    },
    songItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    songDetails: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    moreText: {
        fontSize: 16,
        color: '#888',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 250,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default List;
