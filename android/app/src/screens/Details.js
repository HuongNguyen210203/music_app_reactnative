//
//
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
// import { FIREBASE_DB } from '../../../FirebaseConfig';
// import { getAuth } from "firebase/auth";
// import { doc, onSnapshot, getDoc } from "firebase/firestore";
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';
//
// const Details = () => {
//     const [loading, setLoading] = useState(true);
//     const [likedSongs, setLikedSongs] = useState([]);
//     const [userName, setUserName] = useState('');
//     const auth = getAuth();
//     const currentUser = auth.currentUser; // Get the current user
//     const navigation = useNavigation(); // Navigation object
//
//     useEffect(() => {
//         // If no current user is logged in, stop loading
//         if (!currentUser) {
//             setLoading(false);
//             return;
//         }
//
//         const { uid } = currentUser;
//
//         // Fetch the user information (username) from Firestore
//         const fetchUserName = async () => {
//             const userRef = doc(FIREBASE_DB, 'users', uid); // Assuming 'users' is the collection storing user data
//             const userDoc = await getDoc(userRef);
//
//             if (userDoc.exists()) {
//                 const userData = userDoc.data();
//                 setUserName(userData.username || 'No Username');
//             } else {
//                 setUserName('No Username');
//             }
//         };
//
//         fetchUserName(); // Call the function to fetch the user data
//
//         // Create a reference to the `Favorite-Song` document for this user
//         const favoriteSongsRef = doc(FIREBASE_DB, 'Favorite-Song', uid);
//
//         const unsubscribe = onSnapshot(favoriteSongsRef, async (docSnapshot) => {
//             if (docSnapshot.exists()) {
//                 const data = docSnapshot.data();
//                 const likedSongsArray = data?.songs || [];
//
//                 if (likedSongsArray.length > 0) {
//                     // Fetch song details for each liked song
//                     const songs = likedSongsArray.map(song => {
//                         return {
//                             id: song.id,
//                             title: song.title,
//                             artist: song.artist,
//                             image: song.imageUrl,
//                             audioUrl: song.audioUrl,
//                         };
//                     });
//
//                     setLikedSongs(songs);
//                 } else {
//                     setLikedSongs([]); // No liked songs found
//                 }
//             } else {
//                 setLikedSongs([]); // No document found for the user
//             }
//
//             setLoading(false); // End loading after data is fetched
//         });
//
//         // Cleanup function to unsubscribe from the listener when the component unmounts
//         return () => unsubscribe();
//     }, [currentUser]);
//
//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#FFA500" />
//             </View>
//         );
//     }
//
//     return (
//         <ScrollView style={styles.container}>
//             {/* Profile Section */}
//             <View style={styles.profileContainer}>
//                 <Image
//                     source={require('../assets/images/welcomeimage.png')} // Static welcome image
//                     style={[styles.welcomeImage, { opacity: 0.8 }]}
//                     resizeMode="cover"
//                 />
//                 <Text style={styles.userName}>{userName}</Text>
//             </View>
//
//             {/* Liked Songs Section */}
//             <View style={styles.historyContainer}>
//                 <Text style={styles.historyTitle}>Your Liked Songs</Text>
//                 {likedSongs.length > 0 ? (
//                     likedSongs.map((song) => (
//                         <View key={song.id} style={styles.songCard}>
//                             <Image
//                                 source={{ uri: song.image }} // Display song image
//                                 style={styles.songImage}
//                             />
//                             <View style={styles.songInfo}>
//                                 <Text style={styles.songTitle}>{song.title}</Text>
//                                 <Text style={styles.songArtist}>{song.artist}</Text>
//                             </View>
//                             <TouchableOpacity
//                                 style={styles.playButton}
//                                 onPress={() =>
//                                     navigation.navigate('MusicPlayer', {
//                                         title: song.title,
//                                         audioUrl: song.audioUrl,
//                                         imageUrl: song.image,
//                                         artist: song.artist,
//                                         id: song.id,
//                                     })
//                                 }
//                             >
//                                 <Icon name="play" size={20} color="#FFA500" />
//                             </TouchableOpacity>
//                         </View>
//                     ))
//                 ) : (
//                     <Text style={styles.noSongsText}>No liked songs found.</Text>
//                 )}
//             </View>
//         </ScrollView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#212121', // Dark background
//     },
//     profileContainer: {
//         alignItems: 'center',
//         marginVertical: 20,
//     },
//     welcomeImage: {
//         width: '100%',
//         height: 200,
//     },
//     userName: {
//         fontSize: 24,
//         color: '#fff',
//         marginTop: 10,
//         fontWeight: 'bold',
//     },
//     historyContainer: {
//         marginBottom: 20,
//         paddingHorizontal: 10,
//     },
//     historyTitle: {
//         fontSize: 22,
//         color: '#fff',
//         marginBottom: 10,
//         fontWeight: 'bold',
//     },
//     songCard: {
//         backgroundColor: '#333',
//         marginBottom: 15,
//         borderRadius: 10,
//         flexDirection: 'row',
//         padding: 10,
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     songImage: {
//         width: 60,
//         height: 60,
//         borderRadius: 10,
//         marginRight: 10,
//     },
//     songInfo: {
//         flex: 1,
//     },
//     songTitle: {
//         fontSize: 18,
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     songArtist: {
//         fontSize: 14,
//         color: '#bbb',
//     },
//     playButton: {
//         padding: 5,
//         borderRadius: 100,
//
//     },
//     noSongsText: {
//         fontSize: 18,
//         color: '#fff',
//         textAlign: 'center',
//         marginTop: 20,
//     },
// });
//
// export default Details;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { getAuth, signOut } from "firebase/auth";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Details = () => {
    const [loading, setLoading] = useState(true);
    const [likedSongs, setLikedSongs] = useState([]);
    const [userName, setUserName] = useState('');
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigation = useNavigation();

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const { uid } = currentUser;

        const fetchUserName = async () => {
            try {
                const userRef = doc(FIREBASE_DB, 'users', uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.username || 'No Username');
                } else {
                    setUserName('No Username');
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
                setUserName('Error fetching username');
            }
        };

        fetchUserName();


        const favoriteSongsRef = doc(FIREBASE_DB, 'Favorite-Song', uid);

        const unsubscribe = onSnapshot(favoriteSongsRef, async (docSnapshot) => {
            try {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const likedSongsArray = data?.songs || [];
                    const songs = likedSongsArray.map(song => ({
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        image: song.imageUrl,
                        audioUrl: song.audioUrl,
                    }));
                    setLikedSongs(songs);
                } else {
                    setLikedSongs([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching favorite songs: ', error);
                setLikedSongs([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [currentUser]);


    const handleLogOut = async () => {
        try {
            await signOut(auth);
            navigation.navigate('SignIn');
        } catch (error) {
            console.error('Error logging out: ', error.message);
        }
    };

    if (loading) {
        return (
          <View style={styles.container}>
              <ActivityIndicator size="large" color="#FFA500" />
          </View>
        );
    }

    return (
      <ScrollView style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#FFA500" />
          </TouchableOpacity>

          {/* Log out Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
              <Icon name="sign-out-alt" size={24} color="#FFA500" />
          </TouchableOpacity>

          {/* Profile Section */}
          <View style={styles.profileContainer}>
              <Image
                source={require('../assets/images/welcomeimage.png')}
                style={[styles.welcomeImage, { opacity: 0.8 }]}
                resizeMode="cover"
              />
              <Text style={styles.userName}>{userName}</Text>
          </View>

          {/* Liked Songs Section */}
          <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Favorite Songs</Text>
              {likedSongs.length > 0 ? (
                likedSongs.map((song) => (
                  <View key={song.id} style={styles.songCard}>
                      <Image source={{ uri: song.image }} style={styles.songImage} />
                      <View style={styles.songInfo}>
                          <Text style={styles.songTitle}>{song.title}</Text>
                          <Text style={styles.songArtist}>{song.artist}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.playButton}
                        onPress={() =>
                          navigation.navigate('MusicPlayer', {
                              title: song.title,
                              audioUrl: song.audioUrl,
                              imageUrl: song.image,
                              artist: song.artist,
                              id: song.id,
                          })
                        }
                      >
                          <Icon name="play" size={20} color="#FFA500" />
                      </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noSongsText}>No liked songs found.</Text>
              )}
          </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212121',
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 10,
        zIndex: 1,
        padding: 10,
    },
    logoutButton: {
        position: 'absolute',
        top: 30,
        right: 10,
        zIndex: 1,
        padding: 10,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    welcomeImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderColor: '#FFA500',
        borderWidth: 2,
        alignSelf: 'center',
    },
    userName: {
        fontSize: 24,
        color: '#fff',
        marginTop: 10,
        fontWeight: 'bold',
    },
    historyContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    historyTitle: {
        fontSize: 22,
        color: '#FFA500',
        marginBottom: 10,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    songCard: {
        backgroundColor: '#333',
        marginBottom: 15,
        borderRadius: 10,
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '90%',
        maxWidth: '100%',
        marginHorizontal: '5%',
    },
    songImage: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 10,
    },
    songInfo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    songTitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    songArtist: {
        fontSize: 12,
        color: '#bbb',
        flexWrap: 'wrap',
    },
    playButton: {
        padding: 5,
        borderRadius: 100,
    },
    noSongsText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
    },
});


export default Details;