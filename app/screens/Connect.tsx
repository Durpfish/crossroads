import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

//TODO Replace the image source paths with the actual paths or URLs of your images.
//TODO The handleSearchUsers function can be expanded to perform actual user search logic.

interface ConnectProps {
    navigation: NavigationProp<any, any>;
}
interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Connect = ({ navigation }: ConnectProps) => {
    const [usersAvailable, setUsersAvailable] = useState(true); // Default is no users available (can set to true/false to test)

    const handleSearchUsers = () => {
        // Placeholder function to simulate searching for users
        // In a real app, you would perform a fetch request here
        setUsersAvailable(true); // Change this to `true` when users are found
    };

    const navigateToEvents = () => {
        navigation.navigate('Events');
    };

    return (
        <View style={styles.container}>
            {usersAvailable ? (
                <View style={styles.userAvailableContainer}>
                    <Text style={styles.title}>Love is right around the corner!</Text>
                    <Text style={styles.subtitle}>Match with [Username]?</Text>
                    <Text style={styles.profileDetails}>[Profile details]</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.rejectButton}>
                            <Text style={styles.rejectButtonText}>✗</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptButton}>
                            <Text style={styles.acceptButtonText}>✓</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.noUserContainer}>
                    <Text style={styles.title}>It’s real quiet around this area!</Text>
                    <Text style={styles.subtitle}>Why not sign up for some activities?</Text>
                    <TouchableOpacity style={styles.navigateButton} onPress={navigateToEvents}>
                        <Text style={styles.navigateButtonText}>Go to Events</Text>
                    </TouchableOpacity>
                </View>
            )}
            <NavigationTab navigation={navigation} />
        </View>
    );
};

const NavigationTab = ({ navigation }: RouterProps) => {
    const tabs = [
        { name: "Home", icon: "🏠" },
        { name: "Events", icon: "🎫" },
        { name: "Connect", icon: "🤝🏽" },
        { name: "Matches", icon: "❤️" },
        { name: "Profile", icon: "👤" },
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
        backgroundColor: '#fff',
    },
    userAvailableContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noUserContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    userImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    profileDetails: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
    },
    rejectButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 50,
    },
    rejectButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 50,
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    navigateButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    navigateButtonText: {
        color: '#fff',
        fontSize: 16,
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
    },
});

export default Connect;