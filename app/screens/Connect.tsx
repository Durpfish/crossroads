// Connect.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Connect = ({ navigation }: RouterProps) => {

    const handleConnectPress = () => {
        navigation.navigate('MessageScreen'); // Navigate to ChatScreen
    };

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.text}>Connect Page</Text>
            <ConnectHeader />
            <View style={styles.messagesButtonContainer}>
                <TouchableOpacity onPress={handleConnectPress} style={styles.messagesButton}>
                    <Text style={styles.messagesButtonText}>Messages</Text>
                </TouchableOpacity>
            </View>

            <NavigationTab navigation={navigation} />
        </View>
    );
};

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>CrossRoads</Text>
        </View>
    );
};

const ConnectHeader = () => {
    return (
        <View style={styles.connectContainer}>
            <Text style={styles.connectText}>Connect</Text>
        </View>
    );
};

const NavigationTab = ({ navigation }: RouterProps) => {
    const tabs = [
        { name: "Home", icon: "🏠" },
        { name: "Events", icon: "🎫" },
        { name: "Connect", icon: "🤝🏽" },
        { name: "Profile", icon: "👤" },
        { name: "Settings", icon: "⚙️" },
    ];

    return (
        <View style={styles.navigationTabContainer}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.tabButton}
                    onPress={() => navigation.navigate(tab.name)}
                >
                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                    <Text style={styles.tabText}>{tab.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: 'blue',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
    },
    connectContainer: {
        top: -350,
        width: '100%',
        paddingVertical: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red', // Debugging purposes
    },
    connectText: {
        color: 'black',
        fontSize: 24,
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        marginVertical: 20,
    },
    messagesButtonContainer: {
        position: 'absolute',
        bottom: 80, // Adjusted to avoid overlap with navigation tab
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesButton: {
        backgroundColor: '#72bcd4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    messagesButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    navigationTabContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ddd',
        paddingVertical: 10,
    },
    tabButton: {
        alignItems: 'center',
    },
    tabIcon: {
        fontSize: 24,
    },
    tabText: {
        fontSize: 12,
    }
});


export default Connect;
