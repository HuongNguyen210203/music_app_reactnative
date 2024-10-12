import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback for Android
Sound.setCategory('Playback');

const MusicPlayer = ({ route }) => {
    const { title, artist, audioUrl } = route.params;

    let sound;

    useEffect(() => {
        // Load the sound
        sound = new Sound(audioUrl, null, (error) => {
            if (error) {
                console.log('Failed to load sound', error);
            }
        });

        return () => {
            // Cleanup on unmount
            if (sound) {
                sound.release();
            }
        };
    }, [audioUrl]);

    const playMusic = () => {
        sound.play((success) => {
            if (!success) {
                console.log('Playback failed');
            }
        });
    };

    const stopMusic = () => {
        if (sound) {
            sound.stop();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.artist}>{artist}</Text>
            <Button title="Play" onPress={playMusic} />
            <Button title="Stop" onPress={stopMusic} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 18,
        marginBottom: 20,
    },
});

export default MusicPlayer;
