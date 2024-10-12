import React, { useState } from 'react';
import {
    View,
    TextInput,
    ActivityIndicator,
    Button,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Text,
    Pressable
} from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [signInModalVisible, setSignInModalVisible] = useState(false);
    const [signUpModalVisible, setSignUpModalVisible] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        try {
            setLoading(true);
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            Alert.alert('Sign in successful');
        } catch (error) {
            console.error(error);
            Alert.alert('Sign in failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        try {
            setLoading(true);
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            await sendEmailVerification(response.user);
            Alert.alert('Check your email for verification');
            setSignUpModalVisible(false);
            setSignInModalVisible(true);
        } catch (error) {
            console.error(error);
            Alert.alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Logged out successfully');
        } catch (error) {
            console.error('Logout failed: ', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="height"
        >
            <Button
                title="Show Login Modal"
                onPress={() => setSignInModalVisible(true)}
            />

            {/* Sign-in Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={signInModalVisible}
                onRequestClose={() => setSignInModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Login</Text>
                        <TextInput
                            value={email}
                            style={styles.input}
                            placeholder="Email"
                            autoCapitalize="none"
                            onChangeText={setEmail}
                        />
                        <TextInput
                            value={password}
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={setPassword}
                        />
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setSignInModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonPrimary]}
                                onPress={signIn}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.textStyle}>Sign in</Text>
                                )}
                            </Pressable>
                        </View>

                        <Pressable
                            onPress={() => {
                                setSignInModalVisible(false);
                                setSignUpModalVisible(true);
                            }}
                            style={styles.signupLink}
                        >
                            <Text style={styles.signupText}>Don't have an account? Sign up here</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Sign-up Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={signUpModalVisible}
                onRequestClose={() => setSignUpModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Sign Up</Text>
                        <TextInput
                            value={email}
                            style={styles.input}
                            placeholder="Email"
                            autoCapitalize="none"
                            onChangeText={setEmail}
                        />
                        <TextInput
                            value={password}
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={setPassword}
                        />
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setSignUpModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonPrimary]}
                                onPress={signUp}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.textStyle}>Sign up</Text>
                                )}
                            </Pressable>
                        </View>

                        <Pressable
                            onPress={() => {
                                setSignUpModalVisible(false);
                                setSignInModalVisible(true);
                            }}
                            style={styles.signupLink}
                        >
                            <Text style={styles.signupText}>Already have an account? Sign in here</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

// Define styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        padding: 10,
        borderRadius: 5,
    },
    buttonClose: {
        backgroundColor: '#ccc',
        flex: 1,
        marginRight: 10,
    },
    buttonPrimary: {
        backgroundColor: '#2196F3',
        flex: 1,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    signupLink: {
        marginTop: 15,
    },
    signupText: {
        color: '#2196F3',
        textDecorationLine: 'underline',
    },
});

export default Login;
