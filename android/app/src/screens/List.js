import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Button } from 'react-native';
import { FIREBASE_AUTH, firestore } from '../../../FirebaseConfig'; // Adjust your Firebase import

const List = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const snapshot = await firestore.collection('songs').get(); // Adjust 'songs' to your collection name
                const songList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setSongs(songList);
            } catch (error) {
                console.error('Error fetching songs: ', error);
            }
        };

        fetchSongs();
    }, []);

    const handleSongPress = (songTitle, songArtist, audioUrl) => {
        navigation.navigate('MusicPlayer', { title: songTitle, artist: songArtist, audioUrl });
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search music"
                />
                {/* Menu button */}
                <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.menuText}>Menu</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for hamburger menu */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Button title="Open Details" onPress={() => {
                            navigation.navigate('Details');
                            setModalVisible(false);
                        }} />
                        <Button title="Logout" onPress={() => {
                            FIREBASE_AUTH.signOut();
                            setModalVisible(false);
                        }} />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            {/* Category Filters */}
            <View style={styles.filtersContainer}>
                {['All', 'Album', 'Playlist', 'Artist', 'Explore'].map((filter, index) => (
                    <TouchableOpacity key={index} style={[styles.filterButton, index === 0 && styles.activeFilter]}>
                        <Text style={index === 0 ? styles.activeFilterText : styles.filterText}>{filter}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Song List */}
            <ScrollView style={styles.songList}>
                {songs.map((song) => (
                    <TouchableOpacity key={song.id} style={styles.songItem} onPress={() => handleSongPress(song.title, song.artist, song.audioUrl)}>
                        <View style={styles.songDetails}>
                            <Text style={styles.songTitle}>{song.title}</Text>
                            <Text style={styles.songArtist}>{song.artist}</Text>
                        </View>
                        <Text style={styles.moreText}>More</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Now Playing Bar */}
            <View style={styles.nowPlaying}>
                <Image
                    style={styles.songThumbnail}
                    source={{ uri: 'https://example.com/image.jpg' }} // Replace with actual image URL
                />
                <View style={styles.nowPlayingDetails}>
                    <Text style={styles.nowPlayingTitle}>Mustafa Jaan E Rehmat Pe</Text>
                    <Text style={styles.nowPlayingArtist}>Atif Aslam, Boss Menn</Text>
                </View>
                <TouchableOpacity style={styles.playPauseButton}>
                    <Text style={styles.playPauseText}>Pause</Text>
                </TouchableOpacity>
            </View>
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
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    filterButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#e6e6e6',
    },
    activeFilter: {
        backgroundColor: '#f90',
    },
    filterText: {
        color: '#000',
    },
    activeFilterText: {
        color: '#fff',
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
    songArtist: {
        fontSize: 14,
        color: '#888',
    },
    moreText: {
        fontSize: 16,
        color: '#888',
    },
    nowPlaying: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
    songThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    nowPlayingDetails: {
        flex: 1,
    },
    nowPlayingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    nowPlayingArtist: {
        fontSize: 14,
        color: '#888',
    },
    playPauseButton: {
        padding: 10,
    },
    playPauseText: {
        fontSize: 16,
        color: '#f90',
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
