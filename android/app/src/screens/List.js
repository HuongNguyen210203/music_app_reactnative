import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Image, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import MusicService from '../services/MusicService';

const List = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const fetchedSongs = await MusicService.fetchCollectionData();
                setSongs(fetchedSongs);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSongPress = useCallback((song) => {
        try {
            MusicService.stop();
            MusicService.play(song.mp3).then(r => console.log(r));
            navigation.navigate('MusicPlayer', {
                title: song.title,
                audioUrl: song.mp3,
                imageUrl: song.image,
                artist: song.artist,
                singer: song.singer,
                id: song.id,
                playlist: songs,
            });
        } catch (error) {
            console.error(error);
        }
    }, [navigation, songs]);

    const handleLogOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            navigation.replace('SignIn');
        } catch (error) {
            console.error(error.message);
        }
    };

    const normalizeString = (str) => {
        return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
    };

    const truncateToWords = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    };

    const filteredSongs = songs.filter((song) => {
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
                    placeholderTextColor="#888"
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
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Icon name="user-circle" size={80} color="#FFA500" />
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                        <Text style={styles.modalDescription}>
                            Logging out will end your current session. Do you want to continue?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleLogOut}>
                                <Text style={styles.confirmButtonText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>



            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFA500" />
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    {Object.keys(groupedSongs).map((category) => (
                        <View key={category} style={styles.categoryContainer}>
                            <Text style={styles.categoryTitle}>{category}</Text>
                            {groupedSongs[category].map((song) => (
                                <TouchableOpacity key={song.id} style={styles.songContainer} onPress={() => handleSongPress(song)}>
                                    <Image source={{ uri: song.image }} style={styles.songImage} />
                                    <View style={styles.songInfo}>
                                        <Text style={styles.songTitle}>{truncateToWords(song.title, 5)}</Text>
                                        {song.artist === song.singer ? (
                                            <Text style={styles.songArtist}>{song.artist}</Text>
                                        ) : (
                                            <>
                                                <Text style={styles.songArtist}>{song.artist}</Text>
                                                <Text style={styles.songArtist}>{song.singer}</Text>
                                            </>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}
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
        backgroundColor: '#1F1F1F',
        borderRadius: 25,
        padding: 10,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#2A2A2A',
        color: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        fontSize: 16,
    },
    menuButton: {
        marginLeft: 15,
    },
    scrollView: {
        marginTop: 15,
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
        backgroundColor: '#1F1F1F',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 10,
    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    songArtist: {
        fontSize: 12,
        color: '#888',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#333',
        borderRadius: 25,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '85%',
        elevation: 10,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFA500',
        marginTop: 15,
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#444',
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 25,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FFA500',
        fontWeight: '600',
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: '#FFA500',
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 25,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default List;
