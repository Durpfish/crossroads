import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface UserImage {
    id: string;
    image: string;
    profileName: string;
    profileImage: string; // Added profileImage field
}

const NewsFeed = ({ navigation }: RouterProps) => {
    const [userImages, setUserImages] = useState<UserImage[]>([]);
    const [loading, setLoading] = useState(true);
    const user = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        if (user) {
            const q = query(collection(FIREBASE_FIRESTORE, 'matches'), where('userId', '==', user.uid));
            const unsubscribe = onSnapshot(q, async (querySnapshot) => {
                const imagesData: UserImage[] = [];
                for (const matchDoc of querySnapshot.docs) {
                    const matchData = matchDoc.data();
                    const matchedUserId = matchData.matchedUserId;
                    const profileDoc = await getDoc(doc(FIREBASE_FIRESTORE, 'profiles', matchedUserId));
                    if (profileDoc.exists()) {
                        const profileData = profileDoc.data();
                        const gridImages = profileData.gridImages || [];
                        const profileImage = profileData.profileImage || ''; // Get profile image
                        const profileName = profileData.profileName || 'Unknown'; // Get profile name
                        
                        if (gridImages.length > 0) { // Only include if there are images
                            gridImages.forEach((image: string, index: number) => {
                                imagesData.push({
                                    id: `${matchedUserId}-${index}`, // Combine userId and index for unique key
                                    image: image,
                                    profileImage: profileImage, // Include profile image
                                    profileName: profileName
                                });
                            });
                        }
                    }
                }
                setUserImages(imagesData);
                setLoading(false);
            }, (error) => {
                console.error('Error fetching matched user images: ', error);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const renderImage = ({ item }: { item: UserImage }) => (
        <View style={styles.imageContainer}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
                <View style={styles.profileTextContainer}>
                    <Text style={styles.profileName}>{item.profileName}</Text>
                </View>
            </View>
            <Image source={{ uri: item.image }} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.contentContainer}>
                <Text style={styles.heading}>News Feed</Text>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <FlatList
                        data={userImages}
                        renderItem={renderImage}
                        keyExtractor={(item) => item.id} // Use the unique key
                        style={styles.flatList}
                    />
                )}
            </View>

            {/* Navigation Tab */}
            <NavigationTab navigation={navigation} />
        </View>
    );
};

const Header = () => {
    return (
        <View style={styles.headerContainer}>
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
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#72bcd4',
        paddingVertical: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 24,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingTop: 80, 
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    flatList: {
        width: '100%',
    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '90%',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    profileTextContainer: {
        flexDirection: 'column',
    },
    profileName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    image: {
        width: '90%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 10,
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

export default NewsFeed;