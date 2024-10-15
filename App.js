import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';


import List from '../MusicApp/android/app/src/screens/List';
import Details from '../MusicApp/android/app/src/screens/Details';
import MusicPlayer from './android/app/src/screens/MusicPlayer';
import SignIn from './android/app/src/screens/SignIn';
import SignUp from './android/app/src/screens/SignUp';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0_if_J3ng3_Yb7VWWtwpOr2aAXUcM-Ic",
    authDomain: "reanatauth.firebaseapp.com",
    projectId: "reanatauth",
    storageBucket: "reanatauth.appspot.com",
    messagingSenderId: "550340552858",
    appId: "1:550340552858:web:7d36557a0e188d57c0d723",
    measurementId: "G-RSFTCW7HNC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function InsideTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="List"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'List') {
                        iconName = 'list';
                    } else if (route.name === 'Details') {
                        iconName = 'music';
                    } else if (route.name === 'MusicPlayer') {
                        iconName = 'play-circle';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="List" component={List} />
            <Tab.Screen name="Details" component={Details} />
            <Tab.Screen name="MusicPlayer" component={MusicPlayer} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [isChecked, setChecked] = useState(false);

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setChecked(true);
        });

        return () => unsubscribe();
    }, []);

    if (!isChecked) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user ? "InsideTabNavigator" : "SignIn"}>
                {user ? (
                    <Stack.Screen name="InsideTabNavigator" component={InsideTabNavigator} options={{ headerShown: false }} />
                ) : (
                    <>
                        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
