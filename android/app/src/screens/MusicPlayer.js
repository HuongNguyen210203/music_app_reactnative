import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import musicService, { seekTo, getDuration, startPositionTracking, formatTime } from '../services/MusicService';
import { Easing } from 'react-native';
import Slider from '@react-native-community/slider';
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { checkIfLiked, likeCurrentSong } from '../services/MusicService';

const MusicPlayer = ({ navigation }) => {
    const route = useRoute();
    const { title, audioUrl, imageUrl, artist, id } = route.params;

    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userLiked, setUserLiked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentTitle, setCurrentTitle] = useState(title);
    const [currentImage, setCurrentImage] = useState(imageUrl);
    const [currentArtist, setCurrentArtist] = useState(artist);
    const [currentSongId, setCurrentSongId] = useState(id);  // Track current song ID

    const rotation = useRef(new Animated.Value(0));
    const currentUser = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        const { title, audioUrl, imageUrl, artist, id } = route.params;
        console.log("Initial Params: ", route.params);

        const initializeAudio = async () => {
            try {
                musicService.stop();
                await musicService.play(audioUrl);
                setIsPlaying(true);
                setCurrentTitle(title);
                setCurrentImage(imageUrl);
                setCurrentArtist(artist);
                setCurrentSongId(id);  // Set the song ID for the current song

                const totalDuration = musicService.getDuration();
                setDuration(totalDuration > 0 ? totalDuration : 0);

                if (currentUser) {
                    const liked = await checkIfLiked(id, currentUser.uid);
                    setUserLiked(liked); // Keep the liked status for this song
                }

                startPositionTracking((position, totalDuration) => {
                    setCurrentPosition(position);
                    if (totalDuration > 0) setDuration(totalDuration);
                });



                startRotation();
            } catch (error) {
                setErrorMessage('Error playing the song.');
                console.error(error);
            }
        };

        initializeAudio().then(r => console.log("Initialized Audio"));

        return () => {
            musicService.stop();
            stopRotation();
        };
    }, [audioUrl, id]);



    const handlePlayPause = () => {
        if (isPlaying) {
            musicService.pause();
            stopRotation();
        } else {
            musicService.play(audioUrl, currentPosition);
            startRotation();
        }
        setIsPlaying(!isPlaying);
    };

    const handleLike = async () => {
        if (!currentUser) {
            console.log("User must be logged in to like a song.");
            return;
        }

        const uid = currentUser.uid;
        const song = {
            id: currentSongId,
            title: currentTitle,
            artist: currentArtist,
            audioUrl: audioUrl,
            imageUrl: currentImage
        };

        try {
            // Check again before liking to ensure up-to-date data
            const isLiked = await musicService.checkIfLiked(currentSongId, uid);
            console.log(`Is song liked before liking attempt: ${isLiked}`);

            if (!isLiked) {
                await musicService.likeCurrentSong(uid, song);
                setUserLiked(true); // Update state to reflect the liked status
                console.log("Song liked successfully!");
            } else {
                console.log("Song is already liked. Skipping.");
            }
        } catch (error) {
            console.error("Error liking the song:", error);
        }
    };

    const handleNext = async () => {
        try {
            const nextSong = await musicService.playNext();
            if (nextSong) {
                setUserLiked(false); // Ensure we reset userLiked state
                updateSong(nextSong);

                if (currentUser) {
                    const liked = await musicService.checkIfLiked(nextSong.id, currentUser.uid);
                    console.log(`Next song liked status: ${liked}`);
                    setUserLiked(liked); // Correctly set liked status
                }
            }
        } catch (error) {
            console.error("Error navigating to next song:", error);
        }
    };

    const handlePrevious = async () => {
        try {
            const previousSong = await musicService.playPrevious();
            if (previousSong) {
                setUserLiked(false); // Ensure we reset userLiked state
                updateSong(previousSong);

                if (currentUser) {
                    const liked = await musicService.checkIfLiked(previousSong.id, currentUser.uid);
                    console.log(`Previous song liked status: ${liked}`);
                    setUserLiked(liked); // Correctly set liked status
                }
            }
        } catch (error) {
            console.error("Error navigating to previous song:", error);
        }
    };


    const updateSong = (song) => {
        if (!song || !song.mp3) {
            setErrorMessage('No song to play.');
            return;
        }
        setCurrentTitle(song.title || "Unknown Title");
        setCurrentImage(song.image || "");
        setCurrentArtist(song.artist || "Unknown Artist");
        setCurrentPosition(0);
        setDuration(song.duration || 0);
        setIsPlaying(true);
        setCurrentSongId(song.id);  // Update the current song ID
        startRotation();
    };

    const startRotation = () => {
        rotation.current.setValue(0);
        Animated.loop(
            Animated.timing(rotation.current, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start();
    };

    const stopRotation = () => {
        rotation.current.stopAnimation();
    };

    const rotationInterpolation = rotation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : (
                <>
                    <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                        <Icon2 name={userLiked ? 'heart' : 'heart-o'} size={30} color="#FFA500" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={25} color="#FFA500" />
                    </TouchableOpacity>

                    <Animated.Image
                        source={{ uri: currentImage }}
                        style={[styles.albumArt, { transform: [{ rotate: rotationInterpolation }] }]}
                    />

                    <Text style={styles.title}>{currentTitle}</Text>
                    <Text style={styles.artist}>{currentArtist}</Text>

                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={currentPosition}
                            onSlidingComplete={(value) => seekTo(value)}
                            minimumTrackTintColor="#FFA500"
                            maximumTrackTintColor="#666"
                            thumbTintColor="#FFA500"
                        />
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>

                    <View style={styles.controls}>
                        <TouchableOpacity onPress={handlePrevious}>
                            <Icon name="step-backward" size={30} color="#FFA500" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePlayPause}>
                            <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFA500" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext}>
                            <Icon name="step-forward" size={30} color="#FFA500" />
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#212121',
    },
    albumArt: {
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 3,
        borderColor: '#FFA500',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 18,
        color: '#FFF',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    timeText: {
        color: '#FFF',
        fontSize: 16,
    },
    slider: {
        width: 250,
        height: 40,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginTop: 20,
    },
    likeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default MusicPlayer;

