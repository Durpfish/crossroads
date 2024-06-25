import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface HeaderProps {
    navigation: NavigationProp<any, any>;
}

const Profile = ({ navigation }: RouterProps) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [gridImages, setGridImages] = useState<string[]>(Array(9).fill(null));
    const user = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        const loadImages = async () => {
            if (user) {
                const savedProfileImage = await AsyncStorage.getItem(`${user.uid}_profileImage`);
                const savedGridImages = await AsyncStorage.getItem(`${user.uid}_gridImages`);

                if (savedProfileImage) {
                    setProfileImage(savedProfileImage);
                }
                if (savedGridImages) {
                    setGridImages(JSON.parse(savedGridImages));
                }
            }
        };

        loadImages();
    }, [user]);

    const handleImageUpload = async (index: number) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
            const imageUri = pickerResult.assets[0].uri;

            if (user) {
                if (index === -1) {
                    setProfileImage(imageUri);
                    await AsyncStorage.setItem(`${user.uid}_profileImage`, imageUri);
                } else {
                    setGridImages(prevGridImages => {
                        const newGridImages = [...prevGridImages];
                        newGridImages[index] = imageUri;
                        AsyncStorage.setItem(`${user.uid}_gridImages`, JSON.stringify(newGridImages));
                        return newGridImages;
                    });
                }
            }
        }
    };


    return (
        <View style={styles.container}>
            <Header navigation={navigation} /> 
            <ProfileHeader profileImage={profileImage} />
            <ImageGrid gridImages={gridImages} handleImageUpload={handleImageUpload} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleImageUpload(-1)} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Upload Profile Image</Text>
                </TouchableOpacity>
            </View>
            <NavigationTab navigation={navigation} />
        </View>
    );
};

const Header: React.FC<HeaderProps> = ({ navigation }) => {
    const navigateToSettings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>CrossRoads</Text>
            <TouchableOpacity onPress={navigateToSettings} style={styles.settingsIcon}>
                <Text style={styles.tabIcon}>{"⚙️"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const ProfileHeader = ({ profileImage }: { profileImage: string | null }) => {
    return (
        <View style={styles.profileContainer}>
            {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
                <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            <Text style={styles.profileText}>Profile</Text>
        </View>
    );
};

const ImageGrid = ({ gridImages, handleImageUpload }: { gridImages: string[], handleImageUpload: (index: number) => void }) => {
    return (
        <View style={styles.gridContainer}>
            {gridImages.map((imageUri, index) => (
                <TouchableOpacity key={index} onPress={() => handleImageUpload(index)} style={styles.gridItem}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.gridImage} />
                    ) : (
                        <View style={styles.gridPlaceholder}>
                            <Text style={styles.gridPlaceholderText}>+</Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
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
        paddingTop: 50,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: 'blue',
        paddingVertical: 20,
        alignItems: 'center',
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10, 
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
    },

    profileContainer: {
        marginTop: -110,
        width: '100%',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profileText: {
        color: 'black',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        resizeMode: 'cover',
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
        bottom: 80,
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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
    },
    gridItem: {
        width: '30%',
        aspectRatio: 1,
        margin: '1.5%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    gridImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gridPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    gridPlaceholderText: {
        fontSize: 24,
        color: '#757575',
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
    settingsIcon: {
        position: 'absolute',
        right: 20,
        top: 20,
        padding: 10,
        zIndex: 1, 
    },
});

export default Profile;
