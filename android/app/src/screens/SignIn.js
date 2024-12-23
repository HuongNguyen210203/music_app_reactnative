import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const auth = FIREBASE_AUTH;

    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.5);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, []);

    const signIn = async () => {
        if (!email || !password) {
            return;
        }

        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <Animated.Image
                        source={require('../assets/images/welcomeimage.png')}
                        style={[
                            styles.welcomeImage,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            },
                        ]}
                        resizeMode="cover"
                    />
                    <Text style={styles.header}>Sign in to Ngu Yen</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#ccc"
                            autoCapitalize="none"
                            onChangeText={setEmail}
                        />
                        <View style={styles.passwordInputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                value={password}
                                style={styles.input}
                                placeholder="Enter your password"
                                secureTextEntry={!isPasswordVisible}
                                placeholderTextColor="#ccc"
                                onChangeText={setPassword}
                                maxLength={8}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                                <Icon
                                    name={isPasswordVisible ? 'eye' : 'eye-slash'}
                                    size={16}
                                    color="#FFA500"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={signIn}
                            style={styles.button}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign in'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={styles.signupText}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        Don't have an account? <Text style={styles.signupLink}> Sign up</Text>
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
        backgroundColor: '#1A1A1A', // Chỉnh nền thành màu xám đen
        width: '100%',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
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
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#FFA500',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderRadius: 16,
        color: '#fff',
        backgroundColor: '#212121',
    },
    passwordInputContainer: {
        width: '100%',
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
        top: '60%',
        transform: [{ translateY: -12 }],
    },
    buttonContainer: {
        width: '100%',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#FFA500',
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
    },
    signupText: {
        marginTop: 20,
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    signupLink: {
        textDecorationLine: 'underline',
        color: '#FFA500',
        fontWeight: 'bold',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    }
});

export default SignIn;
