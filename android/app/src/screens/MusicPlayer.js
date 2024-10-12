import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider'; // For progress and volume control
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const MusicPlayer = ({ route }) => {
    const { title, audioUrl } = route.params;

    const [sound, setSound] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(0); // Track the current position of the song
    const [duration, setDuration] = useState(0); // Total duration of the song
    const [isPlaying, setIsPlaying] = useState(false); // Track if the music is playing
    const [volume, setVolume] = useState(1); // Volume level

    useEffect(() => {
        // Load the sound when the component mounts
        const soundInstance = new Sound(audioUrl, null, (error) => {
            if (error) {
                console.log('Failed to load sound', error);
                return;
            }
            setDuration(soundInstance.getDuration()); // Get the duration of the song
            setSound(soundInstance);
        });

        // Clean up when the component unmounts
        return () => {
            if (soundInstance) {
                soundInstance.release();
            }
        };
    }, [audioUrl]);

    // Play the music
    const playMusic = () => {
        if (sound) {
            sound.play((success) => {
                if (success) {
                    console.log('Finished playing');
                    setIsPlaying(false);
                    setCurrentPosition(0);
                } else {
                    console.log('Playback failed');
                }
            });
            setIsPlaying(true);

            // Update the current position every second
            const intervalId = setInterval(() => {
                sound.getCurrentTime((seconds) => {
                    setCurrentPosition(seconds);
                });
            }, 1000);

            // Clear the interval when the music finishes or is stopped
            return () => clearInterval(intervalId);
        }
    };

    // Pause the music
    const pauseMusic = () => {
        if (sound && isPlaying) {
            sound.pause();
            setIsPlaying(false);
        }
    };

    // Stop the music
    const stopMusic = () => {
        if (sound) {
            sound.stop(() => {
                setIsPlaying(false);
                setCurrentPosition(0);
            });
        }
    };

    // Seek the song to a new position
    const seekMusic = (value) => {
        if (sound) {
            sound.setCurrentTime(value);
            setCurrentPosition(value);
        }
    };

    // Adjust the volume
    const changeVolume = (value) => {
        setVolume(value);
        if (sound) {
            sound.setVolume(value);
        }
    };

    // Format time for display (mm:ss)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            {/* Progress Bar */}
            <Slider
                style={styles.progressSlider}
                minimumValue={0}
                maximumValue={duration}
                value={currentPosition}
                onSlidingComplete={seekMusic} // Seek to a new position
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1DB954"
            />
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            {/* Play/Pause/Stop buttons */}
            <Button title={isPlaying ? "Pause" : "Play"} onPress={isPlaying ? pauseMusic : playMusic} />
            <Button title="Stop" onPress={stopMusic} />

            {/* Volume Slider */}
            <Text>Volume</Text>
            <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={changeVolume} // Adjust the volume
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1DB954"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    progressSlider: {
        width: '100%',
        height: 40,
        marginVertical: 10,
    },
    timeContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    timeText: {
        fontSize: 14,
        color: '#333',
    },
    volumeSlider: {
        width: '100%',
        height: 40,
        marginTop: 20,
    },
});

export default MusicPlayer;
