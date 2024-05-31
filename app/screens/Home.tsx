import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebaseConfig';

const Home = () => {
    const handleLogout = () => {
        FIREBASE_AUTH.signOut();
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello! Nothing much to see here</Text>
            <View style={styles.logoutButtonContainer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
    logoutButtonContainer: {
        position: 'absolute',
        bottom: 5,
        width: 100,
        left: 150,
    },
    logoutButton: {
        backgroundColor: '#72bcd4',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        textAlign: 'center',
    }
});

export default Home;