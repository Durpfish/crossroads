import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Settings = ({ navigation }: RouterProps) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleLogout = () => {
        FIREBASE_AUTH.signOut();
    };

    const handleImageUpload = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
            const imageUri = pickerResult.assets[0].uri;
            setProfileImage(imageUri);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <SettingsHeader profileImage={profileImage} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Upload Profile Image</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
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

const SettingsHeader = ({ profileImage }: { profileImage: string | null }) => {
    return (
        <View style={styles.settingsContainer}>
            {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
                <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            <Text style={styles.settingsText}>Profile</Text>
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
    settingsContainer: {
        marginTop: -500,
        width: '100%',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    settingsText: {
        color: 'black',
        fontSize: 24,
        textAlign: 'center',
    },
    profileImage: {
        width: 100,
        height: 50,
        borderRadius: 50,
        marginBottom: 20,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    placeholderText: {
        color: '#757575',
        fontSize: 16,
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        marginVertical: 20,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 100, 
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    uploadButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: '#ff6347',
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


export default Settings;
