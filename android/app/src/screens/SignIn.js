import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, Animated, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const auth = FIREBASE_AUTH;

    const buttonAnimation = new Animated.Value(1);
    const rotationAnimation = new Animated.Value(0);
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        if (!email || !password) {
            //lert.alert('Please enter your email and password.');
            return;
        }

        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            //Alert.alert('Sign in successful');
        } catch (error) {
            //Alert.alert('Sign in failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePressIn = () => {
        Animated.timing(buttonAnimation, {
            toValue: 0.95,
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(buttonAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    // Continuous rotation animation
    useEffect(() => {
        const rotate = () => {
            rotationAnimation.setValue(2); // Reset the rotation value
            Animated.timing(rotationAnimation, {
                toValue: 1,
                duration: 20000, // Duration for a full rotation (adjusted for slower rotation)
                useNativeDriver: true,
            }).start(() => rotate()); // Restart the animation
        };
        rotate();
    }, [rotationAnimation]);

    const rotateInterpolate = rotationAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <Animated.Image
                        source={{ uri: 'https://banner2.cleanpng.com/20230504/efv/transparent-music-note-1711145913526.webp' }} // Replace with your image URL
                        style={[styles.welcomeImage, { transform: [{ rotate: rotateInterpolate }] }]}
                        resizeMode="cover" // Changed to 'cover' to ensure the image fills the circular area
                    />
                    <Text style={styles.header}>Sign in to your account</Text>
                    <TextInput
                        value={email}
                        style={styles.emailInput}
                        placeholder="Email"
                        placeholderTextColor="#ccc"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            value={password}
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={!isPasswordVisible}
                            placeholderTextColor="#ccc"
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                            <Text style={styles.eyeIconText}>{isPasswordVisible ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
                        <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={signIn} style={styles.button} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign in'}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Text
                        style={styles.signupText}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        Don't have an account? Sign up here
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#000', // Black background
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Center items horizontally
    },
    welcomeImage: {
        width: 150, // Set a specific width
        height: 150, // Set a specific height to make it a square
        borderRadius: 75, // Make the image circular
        marginBottom: 20,
        backgroundColor: 'transparent', // Ensure background is transparent
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFA500', // Orange color
    },
    emailInput: {
        width: '100%', // Set width to 100% for maximum width
        height: 50, // Shortened height for the email input
        borderColor: '#FFA500', // Orange border
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        color: '#fff', // White text
    },
    input: {
        width: '100%', // Set width to 100% for maximum width
        height: 50, // Keep the password input field height unchanged
        borderColor: '#FFA500', // Orange border
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        color: '#fff', // White text
        flex: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',
    },
    eyeIconText: {
        fontSize: 20,
        color: '#FFA500', // Orange color
    },
    button: {
        backgroundColor: '#FFA500', // Orange button background
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000', // Black text
        fontSize: 16,
    },
    signupText: {
        marginTop: 15,
        color: '#FFA500', // Orange color
        textAlign: 'center',
    },
});

export default SignIn;
