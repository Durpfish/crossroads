import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { collection, getDocs, setDoc, doc, query, where, getDoc } from 'firebase/firestore';

interface ConnectProps {
    navigation: NavigationProp<any, any>;
}

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Connect = ({ navigation }: ConnectProps) => {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const user = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const querySnapshot = await getDocs(collection(FIREBASE_FIRESTORE, 'profiles'));
                const profilesData: any[] = [];
                querySnapshot.forEach((doc) => {
                    const profileData = doc.data();
                    if (profileData.userId !== user.uid) { // Ensure this check is correct
                        profilesData.push({ id: doc.id, ...profileData });
                    }
                });
                setProfiles(profilesData);
            } catch (error) {
                console.error('Error fetching profiles: ', error);
            }
        };

        fetchProfiles();
    }, [user]);

    const handleReject = () => {
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0); // Reset to the first profile if at the end
        }
    };

    const handleAccept = async () => {
        if (profiles.length === 0) return;

        const likedUserId = profiles[currentIndex].userId;

        try {
            // Add like to the "likes" collection
            await setDoc(doc(FIREBASE_FIRESTORE, 'likes', `${user.uid}_${likedUserId}`), {
                userId: user.uid,
                likedUserId: likedUserId,
            });

            // Check if the liked user has already liked the current user
            const mutualLikeDoc = await getDoc(doc(FIREBASE_FIRESTORE, 'likes', `${likedUserId}_${user.uid}`));
            if (mutualLikeDoc.exists()) {
                // Add match to the "matches" collection
                const profile = profiles[currentIndex];
                await setDoc(doc(FIREBASE_FIRESTORE, 'matches', `${user.uid}_${likedUserId}`), {
                    userId: user.uid,
                    matchedUserId: likedUserId,
                    matchedUserName: profile.profileName, //TODO CHECK
                    matchedUserProfilePic: profile.profileImage,
                });
                await setDoc(doc(FIREBASE_FIRESTORE, 'matches', `${likedUserId}_${user.uid}`), {
                    userId: likedUserId,
                    matchedUserId: user.uid,
                    matchedUserName: user.displayName, // TODO CHECK
                    matchedUserProfilePic: profile.profileImage, // Assumes profile image is same for both
                });
            }
        } catch (error) {
            console.error('Error handling like: ', error);
        }

        if (currentIndex < profiles.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0); // Reset to the first profile if at the end
        }
    };

    const navigateToEvents = () => {
        navigation.navigate('Events');
    };

    const renderProfile = (profile) => (
        <View style={styles.userAvailableContainer}>
            <Text style={styles.title}>Love is right around the corner!</Text>
            <Image source={{ uri: profile.profileImage }} style={styles.userImage} />
            <Text style={styles.subtitle}>Match with {profile.profileName}?</Text>
            <Text style={styles.profileDetails}>Age: {profile.age}</Text>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                    <Text style={styles.rejectButtonText}>✗</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                    <Text style={styles.acceptButtonText}>✓</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {profiles.length > 0 ? (
                renderProfile(profiles[currentIndex])
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
        padding: 20,
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
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        resizeMode: 'cover',
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
