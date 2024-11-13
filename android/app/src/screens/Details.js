// //sample
// import React from 'react';
// import { View, Text } from 'react-native';
//
// const Details = () => {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Details Screen</Text>
//         </View>
//     );
// };
//
// export default Details;
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Sample data for the songs (replace with actual data from Firebase)
const songs = [
    { id: '1', title: 'Song 1', artist: 'Artist 1' },
    { id: '2', title: 'Song 2', artist: 'Artist 2' },
    { id: '3', title: 'Song 3', artist: 'Artist 3' },
    { id: '4', title: 'Song 4', artist: 'Artist 4' },
    { id: '5', title: 'Song 5', artist: 'Artist 5' },
];

const Details = ({ route }) => {
    const { genreName } = route.params || {}; // Fallback if genreName is not passed

    if (!genreName) {
        return (
            <View style={styles.container}>
                <Text style={styles.genreTitle}>Genre not available</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.songCard} onPress={() => console.log(`Play ${item.title}`)}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.artistName}>{item.artist}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.genreTitle}>{genreName}</Text>
            <FlatList
                data={songs}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    genreTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    songCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    songTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    artistName: {
        fontSize: 14,
        color: '#777',
    },
});

export default Details;
