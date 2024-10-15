import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';

// Thiết lập category cho âm thanh
Sound.setCategory('Playback');

const MusicPlayer = ({ route }) => {
    const { title = 'Untitled', audioUrl = '' } = route?.params || {};

    const [sound, setSound] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true); // Đặt mặc định là true để hiển thị icon pause
    const [volume, setVolume] = useState(1);
    const intervalRef = useRef(null);

    useEffect(() => {
        const soundInstance = new Sound(audioUrl, null, (error) => {
            if (error) {
                console.log('Failed to load sound', error);
                return;
            }
            setDuration(soundInstance.getDuration());
            setSound(soundInstance);
            soundInstance.play(() => {
                setIsPlaying(false);
                setCurrentPosition(0);
            });

            // Cập nhật vị trí hiện tại của nhạc
            intervalRef.current = setInterval(() => {
                soundInstance.getCurrentTime((seconds) => {
                    setCurrentPosition(seconds);
                });
            }, 1000);
        });

        return () => {
            if (soundInstance) {
                soundInstance.release();
            }
            clearIntervalRef();
        };
    }, [audioUrl]);

    const playMusic = () => {
        if (sound) {
            sound.play(() => {
                setIsPlaying(false);
                setCurrentPosition(0);
            });
            setIsPlaying(true);
        }
    };

    const pauseMusic = () => {
        if (sound && isPlaying) {
            sound.pause();
            setIsPlaying(false);
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    };

    const seekMusic = (value) => {
        if (sound) {
            sound.setCurrentTime(value);
            setCurrentPosition(value);
        }
    };

    const changeVolume = (value) => {
        setVolume(value);
        if (sound) {
            sound.setVolume(value);
        }
    };

    const clearIntervalRef = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getVolumeIcon = () => {
        if (volume === 0) {
            return 'volume-off';
        } else if (volume > 0 && volume <= 0.3) {
            return 'volume-down';
        } else if (volume > 0.3 && volume <= 0.6) {
            return 'volume-down';
        } else {
            return 'volume-up';
        }
    };

    if (!audioUrl) {
        return <View style={styles.container}><Text>No audio source provided</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <Slider
                style={styles.progressSlider}
                minimumValue={0}
                maximumValue={duration}
                value={currentPosition}
                onSlidingComplete={seekMusic}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1DB954"
            />
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.controlButtons}>
                <TouchableOpacity
                    onPress={handlePlayPause}
                    style={styles.playPauseButton}
                >
                    <Icon name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.volumeContainer}>
                <Icon name={getVolumeIcon()} size={24} color="black" style={styles.volumeIcon} />
                <Slider
                    style={styles.volumeSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={changeVolume}
                    minimumTrackTintColor="#1DB954"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#1DB954"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
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
        marginBottom: 20,
    },
    timeText: {
        fontSize: 14,
        color: '#666',
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },
    playPauseButton: {
        backgroundColor: '#1DB954',
        padding: 15,
        borderRadius: 50,
        elevation: 3,
    },
    volumeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
    },
    volumeIcon: {
        marginRight: 10,
    },
    volumeSlider: {
        flex: 1,
        height: 40,
    },
});

export default MusicPlayer;
