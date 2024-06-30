import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, where, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<{ params: { recipientId: string; recipientName: string } }, 'params'>;
}

interface Message {
  id: string;
  text: string;
  createdAt: { seconds: number, nanoseconds: number };
  userId: string;
  userName: string;
  recipientId: string;
  recipientName: string;
}

const Message = ({ navigation, route }: RouterProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const user = FIREBASE_AUTH.currentUser;

  const recipientId = route?.params?.recipientId;
  const recipientName = route?.params?.recipientName;

  useEffect(() => {
    if (!recipientId || !recipientName) {
      Alert.alert("Error", "Recipient information is missing.");
      navigation.goBack();
      return;
    }

    if (user) {
      const messagesQuery = query(
        collection(FIREBASE_FIRESTORE, 'Messages'),
        where('userId', 'in', [user.uid, recipientId]),
        where('recipientId', 'in', [user.uid, recipientId]),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, querySnapshot => {
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        setMessages(messages);
      }, (error) => {
        console.error('Error in snapshot listener: ', error);
        Alert.alert("Error", "An error occurred while fetching messages. Please try again later.");
      });

      navigation.setOptions({
        headerTitle: `Chat with ${recipientName}`,
      });

      return unsubscribe;
    }
  }, [navigation, user, recipientId, recipientName]);

  const fetchUserName = async (userId: string) => {
    const userDoc = await getDoc(doc(FIREBASE_FIRESTORE, 'profiles', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData?.profileName || "Unknown User";
    }
    return "Unknown User";
  };

  const sendMessage = async () => {
    if (message.trim() && user) {
      try {
        const userName = await fetchUserName(user.uid);

        await addDoc(collection(FIREBASE_FIRESTORE, 'Messages'), {
          text: message,
          createdAt: serverTimestamp(),
          userId: user.uid,
          userName: userName,
          recipientId: recipientId,
          recipientName: recipientName,
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    } else {
      console.error('No authenticated user or message is empty');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const timestamp = item.createdAt ? new Date(item.createdAt.seconds * 1000) : new Date();
    return (
      <View style={styles.message}>
        <Text style={styles.username}>{item.userName}:</Text>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.timestamp}>{format(timestamp, 'p, MMMM dd, yyyy')}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
        style={styles.input}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginVertical: 5,
  },
  username: {
    fontWeight: 'bold',
  },
  text: {
    marginLeft: 5,
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default Message;
