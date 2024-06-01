import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Welcome = ({ navigation }: RouterProps) => {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            setEmail(user.email);
        }
    }, []);

    const handleLogout = () => {
        FIREBASE_AUTH.signOut();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image source={require('../../assets/loadingscreen2.png')} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.logoutButtonContainer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.overlayText}>Hello,{'\n'}{email}</Text>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
    },
    image: {
        width: 500,
        height: 1000,
        resizeMode: 'contain',
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
    },
    overlayText: {
        position: 'absolute',
        top: '50%',
        left: 170,
        transform: [{ translateX: -width * 0.25 }, { translateY: -10 }],
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Welcome;