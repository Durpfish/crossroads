import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Button, ScrollView } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { collection, addDoc, query, where, getDocs, Timestamp, doc, updateDoc } from 'firebase/firestore';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Events = ({ navigation }: RouterProps) => {
    const [events, setEvents] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [maxParticipants, setMaxParticipants] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleListEvent = async () => {
        if (title.trim() === '' || maxParticipants.trim() === '') {
            setErrorMsg('Event title and Max participants are required');
            return;
        }

        try {
            const maxParticipantsNumber = parseInt(maxParticipants, 10);
            if (isNaN(maxParticipantsNumber) || maxParticipantsNumber <= 0) {
                setErrorMsg('Max participants should be a valid number greater than 0');
                return;
            }

            await addDoc(collection(FIREBASE_FIRESTORE, 'events'), {
                title: title,
                maxParticipants: maxParticipantsNumber,
                currentParticipants: [],
                timestamp: Timestamp.now(),
                endTime: Timestamp.now().seconds + 12 * 60 * 60, // 12 hours from now in seconds
            });
            setTitle('');
            setMaxParticipants('');
            fetchEvents(); // Refresh events list
        } catch (error) {
            console.error("Error listing event:", error);
        }
    };

    const fetchEvents = async () => {
        try {
            const now = Timestamp.now();
            const eventsQuery = query(collection(FIREBASE_FIRESTORE, 'events'), where('endTime', '>=', now.seconds));
            const querySnapshot = await getDocs(eventsQuery);
            const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleJoinEvent = async (eventId: string, currentParticipants: string[]) => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            const userId = user.uid;
            if (!currentParticipants.includes(userId)) {
                if (currentParticipants.length < events.find(event => event.id === eventId)?.maxParticipants) {
                    try {
                        await updateDoc(doc(FIREBASE_FIRESTORE, 'events', eventId), {
                            currentParticipants: [...currentParticipants, userId],
                        });
                        fetchEvents(); // Refresh events list after joining
                    } catch (error) {
                        console.error("Error joining event:", error);
                    }
                } else {
                    alert('Maximum number of participants reached for this event.');
                }
            } else {
                alert('You have already joined this event.');
            }
        }
    };

    const calculateRemainingTime = (endTime: number) => {
        const currentTime = Timestamp.now().seconds;
        const remainingTime = endTime - currentTime;
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        return `${hours}h ${minutes}m remaining`;
    };

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.title}>Events Page</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Event Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Max Participants"
                    value={maxParticipants}
                    onChangeText={setMaxParticipants}
                    keyboardType="numeric"
                />
                {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
                <Button title="List Event" onPress={handleListEvent} />
            </View>
            <ScrollView style={styles.eventListContainer}>
                {events.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => handleJoinEvent(item.id, item.currentParticipants)} style={styles.eventContainer}>
                        <Text style={styles.eventTitle}>{item.title}</Text>
                        <Text style={styles.eventDetails}>
                            {calculateRemainingTime(item.endTime)} | Participants: {item.currentParticipants.length}/{item.maxParticipants}
                        </Text>
                        <TouchableOpacity onPress={() => handleJoinEvent(item.id, item.currentParticipants)} style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Join</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
    },
    headerContainer: {
        width: '100%',
        backgroundColor: 'blue',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    formContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    eventListContainer: {
        flex: 1,
        width: '100%',
    },
    eventContainer: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventDetails: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    navigationTabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
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

export default Events;
