import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Login from '../MusicApp/android/app/src/screens/Login';
import List from '../MusicApp/android/app/src/screens/List';
import Details from '../MusicApp/android/app/src/screens/Details';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';  // Import Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Auth

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
const firebaseApp = initializeApp(firebaseConfig);  // Add this line to initialize Firebase

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideStackScreen() {
  return (
      <InsideStack.Navigator initialRouteName="List">
        <InsideStack.Screen name='List' component={List} options={{ headerShown: false }} />
        <InsideStack.Screen name='Details' component={Details} options={{ headerShown: false }} />
      </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth(firebaseApp);  // Use the initialized Firebase app here
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
        <Stack.Navigator initialRouteName={user ? "InsideStack" : "Login"}>
          {user ? (
              <Stack.Screen name='InsideStack' component={InsideStackScreen} options={{ headerShown: false }} />
          ) : (
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
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
