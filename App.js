// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ActivityIndicator } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { initializeApp } from 'firebase/app';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import Icon from 'react-native-vector-icons/FontAwesome';
//
//
// import List from '../MusicApp/android/app/src/screens/List';
// import Details from '../MusicApp/android/app/src/screens/Details';
// import MusicPlayer from './android/app/src/screens/MusicPlayer';
// import SignIn from './android/app/src/screens/SignIn';
// import SignUp from './android/app/src/screens/SignUp';
//
// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyA0_if_J3ng3_Yb7VWWtwpOr2aAXUcM-Ic",
//     authDomain: "reanatauth.firebaseapp.com",
//     projectId: "reanatauth",
//     storageBucket: "reanatauth.appspot.com",
//     messagingSenderId: "550340552858",
//     appId: "1:550340552858:web:7d36557a0e188d57c0d723",
//     measurementId: "G-RSFTCW7HNC"
// };
//
// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
//
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
//
// function InsideTabNavigator() {
//     return (
//         <Tab.Navigator
//             initialRouteName="List"
//             screenOptions={({ route }) => ({
//                 tabBarIcon: ({ color, size }) => {
//                     let iconName;
//                     if (route.name === 'List') {
//                         iconName = 'list';
//                     }else if (route.name === 'MusicPlayer') {
//                         iconName = 'play-circle';
//                     } else if (route.name === 'Details') {
//                         iconName = 'user-circle-o';
//                     }
//                     return <Icon name={iconName} size={size} color={color} />;
//                 },
//                 tabBarActiveTintColor: '#000',
//                 tabBarInactiveTintColor: 'gray',
//                 headerShown: false,
//             })}
//         >
//             <Tab.Screen name="List" component={List} />
//             <Tab.Screen name="MusicPlayer" component={MusicPlayer} />
//             <Tab.Screen name="Details" component={Details} />
//         </Tab.Navigator>
//     );
// }
//
// export default function App() {
//     const [user, setUser] = useState(null);
//     const [isChecked, setChecked] = useState(false);
//
//     useEffect(() => {
//         const auth = getAuth(firebaseApp);
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setUser(currentUser);
//             setChecked(true);
//         });
//
//         return () => unsubscribe();
//     }, []);
//
//     if (!isChecked) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//         );
//     }
//
//     return (
//         <NavigationContainer>
//             <Stack.Navigator initialRouteName={user ? "InsideTabNavigator" : "SignIn"}>
//                 {user ? (
//                     <Stack.Screen name="InsideTabNavigator" component={InsideTabNavigator} options={{ headerShown: false }} />
//                 ) : (
//                     <>
//                         <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
//                         <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
//                     </>
//                 )}
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }
//
// const styles = StyleSheet.create({
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });
//
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

// Importing screens
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

// function InsideTabNavigator() {
//     return (
//         <Tab.Navigator
//             initialRouteName="List"
//             screenOptions={({ route }) => ({
//                 tabBarIcon: ({ color, size }) => {
//                     let iconName;
//                     if (route.name === 'List') {
//                         iconName = 'list';
//                     } else if (route.name === 'MusicPlayer') {
//                         iconName = 'play-circle';
//                     } else if (route.name === 'Details') {
//                         iconName = 'user-circle-o';
//                     }
//                     return <Icon name={iconName} size={size} color={color} />;
//                 },
//                 tabBarActiveTintColor: '#FFA500', // Active tab color
//                 tabBarInactiveTintColor: '#fff', // Inactive tab color
//                 tabBarStyle: {
//                     backgroundColor: '#333', // Background color for the tab bar
//                     borderTopWidth: 0,
//                     overflow: 'hidden', // Ensure content doesn't overflow and show outside borders
//                     elevation: 5, // For Android, this ensures the shadow is applied
//                     borderRadius: 10, // Rounded corners for the tab bar
//                 },
//                 headerShown: false,
//             })}
//         >
//             <Tab.Screen name="List" component={List} />
//             <Tab.Screen name="MusicPlayer" component={MusicPlayer} />
//             <Tab.Screen name="Details" component={Details} />
//         </Tab.Navigator>
//     );
// }
import { SafeAreaView, Platform } from 'react-native';

function InsideTabNavigator() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
            <Tab.Navigator
                initialRouteName="List"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'List') {
                            iconName = 'list';
                        } else if (route.name === 'MusicPlayer') {
                            iconName = 'play-circle';
                        } else if (route.name === 'Account') {
                            iconName = 'user-o';
                        }
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#FFA500', // Active tab color
                    tabBarInactiveTintColor: '#fff', // Inactive tab color
                    tabBarStyle: {
                        backgroundColor: '#333', // Background color for the tab bar
                        borderTopWidth: 0, // Remove top border
                        height: 60, // Adjust tab bar height as needed
                        borderRadius: 10, // Rounded corners
                        marginBottom: 0, // Remove margin at the bottom
                        paddingBottom: 0, // Remove padding at the bottom
                        elevation: 0, // No shadow (avoid white space from shadows)
                        overflow: 'hidden', // Ensure no content overflows
                        shadowOpacity: 0, // Remove shadow on iOS
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="List" component={List} />
                <Tab.Screen name="MusicPlayer" component={MusicPlayer} />
                <Tab.Screen name="Account" component={Details} />
            </Tab.Navigator>
        </SafeAreaView>
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
                <ActivityIndicator size="large" color="#FFA500" />
                <Text style={styles.loadingText}>Loading...</Text>
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
        backgroundColor: '#333', // Background color for the whole container
        paddingHorizontal: 20,
        borderColor: '#FFA500', // Border color around the container
        borderWidth: 2, // Border width for the container
        borderRadius: 10, // Rounded corners for the container
        margin: 10, // Optional: To give some space between the container and edges of the screen
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#FFFFFF', // Text color
        borderBottomColor: '#FFA500', // Border color for the text
        borderBottomWidth: 1, // Bottom border width for the text
        paddingBottom: 5,
    },
});
