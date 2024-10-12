import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback for Android
Sound.setCategory('Playback');

const MusicPlayer = ({ route }) => {
    const { title, audioUrl } = route.params;
    let sound;

    useEffect(() => {
        // Tải và phát nhạc từ URL Firebase Storage
        sound = new Sound(audioUrl, null, (error) => {
            if (error) {
                console.log('Failed to load sound', error);
                return;
            }
        });

        return () => {
            if (sound) {
                sound.release(); // Giải phóng tài nguyên khi component bị hủy
            }
        };
    }, [audioUrl]);

    const playMusic = () => {
        if (sound) {
            sound.play((success) => {
                if (!success) {
                    console.log('Playback failed');
                }
            });
        }
    };

    const stopMusic = () => {
        if (sound) {
            sound.stop();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Button title="Play" onPress={playMusic} />
            <Button title="Stop" onPress={stopMusic} />
        </View>
    );
};

// Định nghĩa styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Nền trắng
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Màu chữ tối
    },
});

export default MusicPlayer;
