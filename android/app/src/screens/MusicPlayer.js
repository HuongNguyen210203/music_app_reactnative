import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import MusicService from '../services/MusicService';
import { FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const MusicPlayer = ({ route }) => {
    const { title: initialTitle = 'Untitled', audioUrl = '' } = route?.params || {};
    const [images, setImages] = useState([]);
    const [songs, setSongs] = useState([]);
    const [currentTrackImage, setCurrentTrackImage] = useState('');
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [title, setTitle] = useState(initialTitle);
    const intervalRef = useRef(null);

    // Rotation Animation setup
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Rotation animation function
    const startRotation = () => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 11000, // 8 seconds for a full rotation
                useNativeDriver: true,
            })
        ).start();
    };

    // Stop rotation
    const stopRotation = () => {
        rotateAnim.stopAnimation();
        rotateAnim.setValue(0); // Reset rotation to start
    };

    // Start or stop rotation based on play state
    useEffect(() => {
        if (isPlaying) {
            startRotation();
        } else {
            stopRotation();
        }
    }, [isPlaying]);

    useEffect(() => {
        const fetchSongsAndImages = async () => {
            const storageRef = ref(FIREBASE_STORAGE, 'Music');
            const imagesRef = ref(FIREBASE_STORAGE, 'Images');
            try {
                // Fetch Songs
                const songResult = await listAll(storageRef);
                const songPromises = songResult.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return {
                        title: itemRef.name.split('.')[0],
                        url,
                        author: 'HIEUTHUHAI',
                    };
                });
                const songsData = await Promise.all(songPromises);
                setSongs(songsData);
                MusicService.initializeQueue(songsData);

                // Fetch Images
                const imageResult = await listAll(imagesRef);
                const imagePromises = imageResult.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return { title: itemRef.name.split('.')[0], url };
                });
                const imagesData = await Promise.all(imagePromises);
                setImages(imagesData);

                const matchedImage = getImageForSong(initialTitle);
                setCurrentTrackImage(matchedImage);
            } catch (error) {
                console.error('Error fetching data from Firebase Storage:', error);
            }
        };

        fetchSongsAndImages();
    }, [initialTitle]);

    const normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };

    const getImageForSong = (songTitle) => {
        const normalizedSongTitle = normalizeString(songTitle);
        let bestMatch = null;
        let maxMatchingChars = 0;

        images.forEach((image) => {
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

    useEffect(() => {
        if (audioUrl) {
            loadTrack(audioUrl, initialTitle);
        }

        return () => {
            MusicService.release();
            clearInterval(intervalRef.current); // clear the interval when unmounting
        };
    }, [audioUrl, initialTitle]);

    const loadTrack = async (url, trackTitle) => {
        setCurrentPosition(0);
        setIsPlaying(true);

        const matchedImage = getImageForSong(trackTitle);
        setCurrentTrackImage(matchedImage);
        setTitle(trackTitle);

        try {
            const audioDuration = await MusicService.load(url);
            setDuration(audioDuration);
        } catch (error) {
            console.error('Error loading track:', error);
        }

        MusicService.play();
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            MusicService.getCurrentTime((seconds) => {
                setCurrentPosition(seconds);
            });
        }, 1000);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            MusicService.pause();
        } else {
            MusicService.play(() => setIsPlaying(false));
        }
        setIsPlaying(!isPlaying);
    };

    const handleNextTrack = async () => {
        MusicService.stop();
        MusicService.nextTrack();
        const nextTrack = MusicService.getCurrentTrackInfo();

        if (nextTrack) {
            await loadTrack(nextTrack.url, nextTrack.title);
            const matchedImage = getImageForSong(nextTrack.title);
            setCurrentTrackImage(matchedImage);
        }
    };

    const handlePreviousTrack = async () => {
        MusicService.stop();
        MusicService.previousTrack();
        const previousTrack = MusicService.getCurrentTrackInfo();

        if (previousTrack) {
            await loadTrack(previousTrack.url, previousTrack.title);
            const matchedImage = getImageForSong(previousTrack.title);
            setCurrentTrackImage(matchedImage);
        }
    };

    const seekMusic = (value) => {
        MusicService.seekTo(value);
        setCurrentPosition(value);
    };

    const changeVolume = (value) => {
        setVolume(value);
        MusicService.setVolume(value);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Rotation interpolation
    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {currentTrackImage ? (
                <Animated.Image
                    source={{ uri: currentTrackImage }}
                    style={[styles.trackImage, { transform: [{ rotate: rotateInterpolate }] }]}
                />
            ) : null}
            <Text style={styles.title}>{title}</Text>

            <Slider
                style={styles.progressSlider}
                minimumValue={0}
                maximumValue={duration}
                value={currentPosition}
                onSlidingComplete={seekMusic}
                minimumTrackTintColor="#FFA500"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#FFA500"
            />
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.controlButtons}>
                <TouchableOpacity onPress={handlePreviousTrack} style={styles.controlButton}>
                    <Icon name="step-backward" size={30} color="#FFA500" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
                    <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNextTrack} style={styles.controlButton}>
                    <Icon name="step-forward" size={30} color="#FFA500" />
                </TouchableOpacity>
            </View>

            <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={changeVolume}
                minimumTrackTintColor="#FFA500"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#FFA500"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    trackImage: {
        width: 250,
        height: 250,
        borderRadius: 125, // make the image circular
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        color: '#FFF',
        marginBottom: 10,
    },
    progressSlider: {
        width: '80%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    timeText: {
        color: '#FFF',
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        marginTop: 20,
    },
    controlButton: {
        padding: 10,
    },
    volumeSlider: {
        width: '80%',
        height: 40,
        marginTop: 20,
    },
});

export default MusicPlayer;

