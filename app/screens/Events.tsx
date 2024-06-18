import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';

const Events: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Events Page</Text>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});


export default Events;