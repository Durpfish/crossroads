import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE, FIREBASE_STORAGE } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface HeaderProps {
    navigation: NavigationProp<any, any>;
}

const Profile = ({ navigation }: RouterProps) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [gridImages, setGridImages] = useState<string[]>(Array(6).fill(null));
    const [profileName, setProfileName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const user = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        const loadProfileData = async () => {
            if (user) {
                const docRef = doc(FIREBASE_FIRESTORE, 'profiles', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const profileData = docSnap.data();
                    setProfileImage(profileData.profileImage || null);
                    setGridImages(profileData.gridImages || Array(6).fill(null));
                    setProfileName(profileData.profileName || '');
                    setAge(profileData.age || '');
                }
            }
        };

        loadProfileData();
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
            const uploadUrl = await uploadImageAsync(imageUri);

            if (user) {
                if (index === -1) {
                    setProfileImage(uploadUrl);
                    await AsyncStorage.setItem(`${user.uid}_profileImage`, uploadUrl);
                } else {
                    setGridImages(prevGridImages => {
                        const newGridImages = [...prevGridImages];
                        newGridImages[index] = uploadUrl;
                        AsyncStorage.setItem(`${user.uid}_gridImages`, JSON.stringify(newGridImages));
                        return newGridImages;
                    });
                }
                saveProfileToFirestore(user.uid, uploadUrl, gridImages, profileName, age);
            }
        }
    };

    const uploadImageAsync = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const fileRef = ref(FIREBASE_STORAGE, `images/${user.uid}/${Date.now()}`);
        await uploadBytes(fileRef, blob);

        blob.close();

        return await getDownloadURL(fileRef);
    };

    const saveProfileToFirestore = async (userId, profileImage, gridImages, profileName, age) => {
        try {
            await setDoc(doc(FIREBASE_FIRESTORE, 'profiles', userId), {
                userId,
                profileImage,
                gridImages,
                profileName,
                age,
                createdAt: new Date(),
            });
            console.log('Profile saved to Firestore');
        } catch (error) {
            console.error('Error saving profile to Firestore: ', error);
        }
    };

    const handleSaveProfile = async () => {
        if (user) {
            console.log('Saving profile...');
            console.log('Profile Image:', profileImage);
            console.log('Grid Images:', gridImages);
            console.log('Profile Name:', profileName);
            console.log('Age:', age);

            await AsyncStorage.setItem(`${user.uid}_profileName`, profileName);
            await AsyncStorage.setItem(`${user.uid}_age`, age);
            saveProfileToFirestore(user.uid, profileImage, gridImages, profileName, age);
        }
    };

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <ProfileHeader profileImage={profileImage} />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Profile Name"
                    value={profileName}
                    onChangeText={setProfileName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
            </View>
            <ImageGrid gridImages={gridImages} handleImageUpload={handleImageUpload} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleImageUpload(-1)} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Upload Profile Image</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Profile</Text>
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
            <Text style={styles.profileText}>Your Profile</Text>
        </View>
    );
};

const ImageGrid = ({ gridImages, handleImageUpload }: { gridImages: string[], handleImageUpload: (index: number) => void }) => {
    return (
        <View style={styles.gridContainer}>
            {gridImages.slice(0, 6).map((imageUri, index) => (
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
        { name: "Events", icon: "📅" },
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
        backgroundColor: '#72bcd4',
        paddingVertical: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        zIndex:2,
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
    },
    inputContainer: {
        width: '80%',
        marginVertical: 10, // Reduce margin between input boxes
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5, // Reduce vertical margin
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
        zIndex: 1,
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
        flexDirection: 'row', // Align buttons in a row
        justifyContent: 'space-around', // Distribute space evenly
        width: '80%', // Ensure the container doesn't overlap with grids
        marginTop: 20, // Add some spacing from the grids
    },
    uploadButton: {
        backgroundColor: '#72bcd4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    uploadButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#72bcd4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    saveButtonText: {
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
        right: 10,  // Changed to reduce margin to right edge
        top: 100,    // Adjusted to move down 15px from the original position
        padding: 10,
        zIndex: 1,
    },
});

export default Profile;
