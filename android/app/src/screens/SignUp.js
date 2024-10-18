import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(response.user);
            // Alert.alert('Check your email for verification');
            navigation.navigate('SignIn'); // Navigate back to SignIn screen
        } catch (error) {
            // Alert.alert('Sign up failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create an account</Text>
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
            <Button title="Sign up" onPress={signUp} />

            <Text
                style={styles.signupText}
                onPress={() => navigation.navigate('SignIn')} // Navigate to SignIn screen
            >
                Already have an account? Sign in here
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

export default SignUp;
