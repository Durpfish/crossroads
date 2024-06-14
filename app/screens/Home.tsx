import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebaseConfig';
// import { Redirect } from 'expo-router'; // Ensure this is commented out if not used

const Home = () => {
    const handleLogout = () => {
        FIREBASE_AUTH.signOut();
    };

    return ( 
        <View style={styles.container}>
            <Header/>
            <Text style={styles.text}>Hello! Nothing much to see here</Text>
            <View style={styles.logoutButtonContainer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <NavigationTab />
        </View>
    ); 
};

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>CrossRoads</Text>
        </View>
    );
}

const NavigationTab = () => {
    const tabs = [
        { name: "Home", icon: "🏠" },
        { name: "Profile", icon: "👤" },
        { name: "Settings", icon: "⚙️" },
    ];

    return (
        <View style={styles.navigationTabContainer}>
            {tabs.map((tab, index) => (
                <TouchableOpacity key={index} style={styles.tabButton}>
                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                    <Text style={styles.tabText}>{tab.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

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
    text: {
        textAlign: 'center',
        fontSize: 18,
        marginVertical: 20,
    },
    logoutButtonContainer: {
        position: 'absolute',
        bottom: 60, // Adjusted to avoid overlap with navigation tab
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#72bcd4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    logoutButtonText: {
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

export default Home;
