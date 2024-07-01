import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { collection, addDoc, query, where, getDocs, Timestamp, doc, updateDoc, orderBy, limit, startAfter } from 'firebase/firestore';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Events = ({ navigation }: RouterProps) => {
    const [events, setEvents] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [maxParticipants, setMaxParticipants] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

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
                endTime: Timestamp.now().seconds + 12 * 60 * 60,
            });
            setTitle('');
            setMaxParticipants('');
            fetchEvents();
        } catch (error) {
            console.error("Error listing event:", error);
        }
    };

    const fetchEvents = async (refresh = false) => {
        try {
            if (refresh) setRefreshing(true); // Set refreshing to true before starting fetch
    
            const now = Timestamp.now();
            let eventsQuery = query(
                collection(FIREBASE_FIRESTORE, 'events'),
                where('endTime', '>=', now.seconds),
                orderBy('endTime'),
                limit(10)
            );
    
            if (!refresh && lastVisible) {
                eventsQuery = query(eventsQuery, startAfter(lastVisible));
            }
    
            const querySnapshot = await getDocs(eventsQuery);
            const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
            if (refresh) {
                setEvents(eventsData); // Replace events array on refresh
            } else {
                setEvents(prevEvents => {
                    // Filter out any duplicate events by checking IDs
                    const newEvents = eventsData.filter(newEvent => !prevEvents.find(oldEvent => oldEvent.id === newEvent.id));
                    return [...prevEvents, ...newEvents];
                });
            }
    
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setRefreshing(false); // Set refreshing to false after fetch completes
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
                        alert('Successfully joined the event!');
                        fetchEvents(true); 
                    } catch (error) {
                        console.error("Error joining event:", error);
                    }
                } else {
                    alert('Maximum number of participants reached for this event.');
                }
            } else {
                try {
                    const updatedParticipants = currentParticipants.filter((participant) => participant !== userId);
                    await updateDoc(doc(FIREBASE_FIRESTORE, 'events', eventId), {
                        currentParticipants: updatedParticipants,
                    });
                    alert('Successfully left the event.');
                    fetchEvents(true); 
                } catch (error) {
                    console.error("Error leaving event:", error);
                }
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

    const isUserJoined = (currentParticipants: string[]) => {
        const user = FIREBASE_AUTH.currentUser;
        return user && currentParticipants.includes(user.uid);
    };

    const renderEventItem = ({ item }: { item: any }) => (
        <View style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDetails}>
                {calculateRemainingTime(item.endTime)} | Participants: {item.currentParticipants.length}/{item.maxParticipants}
            </Text>
            <TouchableOpacity onPress={() => handleJoinEvent(item.id, item.currentParticipants)} style={[styles.joinButton, { backgroundColor: isUserJoined(item.currentParticipants) ? 'red' : '#78b075' }]}>
                <Text style={styles.joinButtonText}>{isUserJoined(item.currentParticipants) ? 'Leave' : 'Join'}</Text>
            </TouchableOpacity>
        </View>
    );

    const handleRefresh = () => {
        fetchEvents(true);
    };

    const handleLoadMore = () => {
        fetchEvents();
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
                <TouchableOpacity onPress={handleListEvent} style={styles.listEventButton}>
                    <Text style={styles.listEventButtonText}>List Event</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={events}
                renderItem={renderEventItem}
                keyExtractor={(item) => item.id}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            />
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    formContainer: {
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 20,
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
    listEventButton: {
        backgroundColor: '#72bcd4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    listEventButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
    refreshButton: {
        backgroundColor: '#72bcd4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        position: 'absolute',
        bottom: 90,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Events;
