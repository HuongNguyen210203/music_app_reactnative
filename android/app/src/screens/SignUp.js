// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
// import { FIREBASE_AUTH } from '../../../FirebaseConfig';
// import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
//
// const SignUp = ({ navigation }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const auth = FIREBASE_AUTH;
//
//     const signUp = async () => {
//         try {
//             const response = await createUserWithEmailAndPassword(auth, email, password);
//             await sendEmailVerification(response.user);
//             // Alert.alert('Check your email for verification');
//             navigation.navigate('SignIn'); // Navigate back to SignIn screen
//         } catch (error) {
//             // Alert.alert('Sign up failed', error.message);
//         }
//     };
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Create an account</Text>
//             <TextInput
//                 value={email}
//                 style={styles.input}
//                 placeholder="Email"
//                 autoCapitalize="none"
//                 onChangeText={setEmail}
//             />
//             <TextInput
//                 value={password}
//                 style={styles.input}
//                 placeholder="Password"
//                 secureTextEntry={true}
//                 onChangeText={setPassword}
//             />
//             <Button title="Sign up" onPress={signUp} />
//
//             <Text
//                 style={styles.signupText}
//                 onPress={() => navigation.navigate('SignIn')} // Navigate to SignIn screen
//             >
//                 Already have an account? Sign in here
//             </Text>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 16,
//     },
//     header: {
//         fontSize: 24,
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     input: {
//         height: 40,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         marginBottom: 12,
//         paddingHorizontal: 8,
//     },
//     signupText: {
//         marginTop: 15,
//         color: '#FFA500',
//         textAlign: 'center',
//     },
// });
//
// export default SignUp;




import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5'; // FontAwesome icons

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [loading, setLoading] = useState(false);

    const signUp = async () => {
        if (!email || !password || !username || !dateOfBirth) {
            return;
        }

        setLoading(true);
        try {
            // Create a new user with email and password
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = userCredential.user;

            // Log the user out immediately after account creation
            await signOut(FIREBASE_AUTH);

            // Notify the user that they are logged out and need to sign in
            Alert.alert('Account Created', 'You have been logged out. Please sign in to continue.');

        } catch (error) {
            console.error(error.message);
            // Handle any errors (e.g., show an alert to the user)
            Alert.alert('Sign Up Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={30} color="#FFA500" />
            </TouchableOpacity>

            {/* Welcome Image */}
            <Image
                source={require('../assets/images/welcomeimage.png')}
                style={[styles.welcomeImage, { opacity: 0.8 }]}
                resizeMode="cover"
            />

            <Text style={styles.header}>Sign Up</Text>

            {/* Form Inputs with Labels */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    value={username}
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#aaa"
                    onChangeText={setUsername}
                />

                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                    value={dateOfBirth}
                    style={styles.input}
                    placeholder="Enter your date of birth"
                    placeholderTextColor="#aaa"
                    onChangeText={setDateOfBirth}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    value={password}
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry
                    placeholderTextColor="#aaa"
                    onChangeText={setPassword}
                />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={signUp}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            {/* Navigate to Sign In */}
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
        padding: 16,
        backgroundColor: '#1E2019',  // Dark background color
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        zIndex: 1,
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
    header: {
        fontSize: 26,
        marginBottom: 20,
        color: '#FFA500',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderColor: '#FFA500',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 12,
        color: '#fff',
        backgroundColor: '#333',
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#FFA500',
        padding: 10,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    signupText: {
        marginTop: 10,
        fontSize: 14,
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


