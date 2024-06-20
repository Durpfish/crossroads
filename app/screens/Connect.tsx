import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface NearbyUser {
    id: string;
    name: string;
    profilePic: string; // Assuming profilePic is the URL or local path to the profile picture
}

const Connect = ({ navigation }: RouterProps) => {

    const handleConnectPress = () => {
        navigation.navigate('MessageScreen'); // Navigate to ChatScreen
    };

    // Dummy data for nearby users (replace with actual data or API call)
    const nearbyUsers: NearbyUser[] = [
        { id: '1', name: 'Alice', profilePic: 'https://st.depositphotos.com/1000686/3738/i/450/depositphotos_37383675-stock-photo-portrait-of-a-young-beautiful.jpg' },
        { id: '2', name: 'Bob', profilePic: 'https://bpb-us-w2.wpmucdn.com/portfolio.newschool.edu/dist/2/485/files/2014/08/DSC_1004-2-1a1yqd6.jpg' },
        // Add more users as needed
    ];

    // Render item for each nearby user
    const renderNearbyUser = ({ item }: { item: NearbyUser }) => (
        <TouchableOpacity style={styles.userItem} onPress={handleConnectPress}>
            <View style={styles.userDetails}>
                <View style={styles.profilePicContainer}>
                    <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
                </View>
                <Text style={styles.userName}>{item.name}</Text>
            </View>
            <TouchableOpacity style={styles.messageButton} onPress={handleConnectPress}>
                <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.title}>Connect Page</Text>
            <ConnectHeader />
            
            {/* Display nearby users */}
            <FlatList
                data={nearbyUsers}
                renderItem={renderNearbyUser}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
            />

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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        paddingTop: 15,
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
    flatList: {
        width: '100%',
        paddingHorizontal: 20,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Aligns items along the row, pushing message button to the right
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    userDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePicContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 15,
    },
    profilePic: {
        width: '100%',
        height: '100%',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    messageButton: {
        backgroundColor: '#72bcd4',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    messageButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
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
    }
});

export default Connect;
