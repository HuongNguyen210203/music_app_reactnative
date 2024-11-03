import Sound from 'react-native-sound';

class MusicService {
    constructor() {
        this.sound = null;
        this.isPlaying = false;
        this.queue = [];
        this.currentTrackIndex = 0;
        this.volume = 1.0; // Volume level between 0.0 and 1.0
        this.onPlaybackComplete = null;
    }

    initializeQueue(songs) {
        // Initialize the queue with songs
        this.queue = songs.map(song => ({
            url: song.url,
            title: song.title,
            art: song.art // URL or path to the album art
        }));
        this.currentTrackIndex = 0;
        console.log('Queue initialized with songs:', this.queue);
    }

    async load(audioUrl) {
        return new Promise((resolve, reject) => {
            this.release(); // Release any previous instance
            this.sound = new Sound(audioUrl, null, (error) => {
                if (error) {
                    console.log('Failed to load sound', error);
                    reject(error);
                    return;
                }
                this.sound.setVolume(this.volume);
                resolve(this.sound.getDuration());
            });
        });
    }

    play(onComplete) {
        if (this.sound) {
            this.sound.play((success) => {
                if (success) {
                    console.log('Finished playing');
                    if (onComplete) {
                        onComplete();
                    }
                } else {
                    console.log('Playback failed');
                }
            });
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.sound) {
            this.sound.pause();
            this.isPlaying = false;
        }
    }

    stop() {
        if (this.sound) {
            this.sound.stop(() => {
                console.log('Playback stopped');
            });
            this.isPlaying = false;
        }
    }

    nextTrack() {
        if (this.queue.length === 0) return;

        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.queue.length;
        this.load(this.queue[this.currentTrackIndex].url);
    }

    previousTrack() {
        if (this.queue.length === 0) return;

        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.queue.length) % this.queue.length;
        this.load(this.queue[this.currentTrackIndex].url);
    }

    release() {
        if (this.sound) {
            this.sound.release();
            this.sound = null;
            this.isPlaying = false;
        }
    }

    seekTo(seconds) {
        if (this.sound) {
            this.sound.setCurrentTime(seconds);
        }
    }

    setVolume(value) {
        this.volume = value;
        if (this.sound) {
            this.sound.setVolume(value);
        }
    }

    getCurrentTrackInfo() {
        return this.queue[this.currentTrackIndex] || null;
    }

    getCurrentTime(callback) {
        if (this.sound) {
            this.sound.getCurrentTime((seconds) => {
                if (callback) {
                    callback(seconds);
                }
            });
        }
    }
}

export default new MusicService();
