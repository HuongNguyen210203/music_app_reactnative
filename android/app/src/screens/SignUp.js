import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig';

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [loading, setLoading] = useState(false);

    const signUp = async () => {
        if (!email || !password || !username || !dateOfBirth) {
            Alert.alert('Missing Information', 'Please fill in all the fields.');
            return;
        }

        setLoading(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = userCredential.user;

            // Save additional user data to Firestore
            const userRef = doc(FIREBASE_DB, 'users', user.uid); // Reference to user document
            await setDoc(userRef, {
                username,
                email,
                dateOfBirth,
                createdAt: new Date().toISOString(),
            });


            const favoriteSongsRef = doc(FIREBASE_DB, 'Favorite-Song', user.uid); // Reference to the user's favorite songs folder
            await setDoc(favoriteSongsRef, {
                songs: [],
            });

            await FIREBASE_AUTH.signOut();

            Alert.alert('Success', 'Your account has been created. Please log in to continue.');

            navigation.navigate('SignIn');
        } catch (error) {
            console.error('Error during sign-up:', error.message);
            Alert.alert('Sign-Up Failed', error.message);
        } finally {
            setLoading(false);
        }
    };
    //     try {
    //         // Create user with email and password
    //         const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    //         const user = userCredential.user;
    //
    //         // Save additional user data to Firestore
    //         const userRef = doc(FIREBASE_DB, 'users', user.uid); // Reference to user document
    //         await setDoc(userRef, {
    //             username,
    //             email,
    //             dateOfBirth,
    //             createdAt: new Date().toISOString(),
    //         });
    //
    //         // Create an empty folder in "Favorite-Songs" for the user
    //         const favoriteSongsRef = doc(FIREBASE_DB, 'Favorite-Song', user.uid); // Reference to the user's favorite songs folder
    //         await setDoc(favoriteSongsRef, {
    //             songs: [], // Initialize with an empty array for the user's favorite songs
    //         });
    //
    //         Alert.alert('Success', 'Your account has been created.');
    //         navigation.navigate('SignIn');
    //     } catch (error) {
    //         console.error('Error during sign-up:', error.message);
    //         Alert.alert('Sign-Up Failed', error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
      <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={30} color="#FFA500" />
          </TouchableOpacity>

          <Image
            source={require('../assets/images/welcomeimage.png')}
            style={styles.welcomeImage}
            resizeMode="cover"
          />

          <Text style={styles.header}>Sign up</Text>

          <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                value={username}
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#F2F2F2"
                onChangeText={setUsername}
              />

              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                value={dateOfBirth}
                style={styles.input}
                placeholder="Enter your date of birth"
                placeholderTextColor="#F2F2F2"
                onChangeText={setDateOfBirth}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#F2F2F2"
                autoCapitalize="none"
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                placeholderTextColor="#F2F2F2"
                onChangeText={setPassword}
              />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={signUp}
            disabled={loading}
          >
              <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
              Already have an account?
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('SignIn')}
              >
                  {' '}Sign in here
              </Text>
          </Text>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#1E2019',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 25,
        zIndex: 1,
    },
    welcomeImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 20,
        borderColor: '#FFA500',
        borderWidth: 3,
        alignSelf: 'center',
    },
    header: {
        fontSize: 28,
        marginBottom: 15,
        color: '#F2F2F2',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 55,
        borderColor: '#FFA500',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderRadius: 16,
        fontSize: 15,
        backgroundColor: '#212121',
        color: '#F2F2F2',
    },
    button: {
        backgroundColor: '#FFA500',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: '#FF8C00',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff',
    },
    linkText: {
        color: '#FFA500',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default SignUp;