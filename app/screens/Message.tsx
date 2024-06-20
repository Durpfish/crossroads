// MessageScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

interface Message {
  id: string;
  text: string;
  createdAt: { seconds: number, nanoseconds: number };
  userId: string;
  userEmail: string;
}

const MessageScreen = ({ navigation }: RouterProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesQuery = query(
      collection(FIREBASE_FIRESTORE, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, querySnapshot => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(messages);
    });

    navigation.setOptions({
      headerTitle: 'Messages',
    });

    return unsubscribe;
  }, [navigation]);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          await addDoc(collection(FIREBASE_FIRESTORE, 'messages'), {
            text: message,
            createdAt: serverTimestamp(),
            userId: user.uid,
            userEmail: user.email
          });
          setMessage('');
        } else {
          console.error('No authenticated user');
        }
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.email}>{item.userEmail}:</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
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
  email: {
    fontWeight: 'bold',
  },
  text: {
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

export default MessageScreen;
