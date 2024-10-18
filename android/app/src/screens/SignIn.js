import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            // Alert.alert('Sign in successful');
        } catch (error) {
            // Alert.alert('Sign in failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sign in to your account</Text>
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
            <Button title="Sign in" onPress={signIn} />

            <Text
                style={styles.signupText}
                onPress={() => navigation.navigate('SignUp')} // Navigate to SignUp screen
            >
                Don't have an account? Sign up here
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    signupText: {
        marginTop: 15,
        color: '#2196F3',
        textAlign: 'center',
    },
});

export default SignIn;
