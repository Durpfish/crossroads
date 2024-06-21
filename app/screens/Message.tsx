import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, where, serverTimestamp } from 'firebase/firestore';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<{ params: { recipientId: string; recipientEmail: string } }, 'params'>;
}

interface Message {
  id: string;
  text: string;
  createdAt: { seconds: number, nanoseconds: number };
  userId: string;
  userEmail: string;
  recipientId: string;
  recipientEmail: string;
}

const MessageScreen = ({ navigation, route }: RouterProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const user = FIREBASE_AUTH.currentUser;

  const recipientId = route?.params?.recipientId;
  const recipientEmail = route?.params?.recipientEmail;

  useEffect(() => {
    if (!recipientId || !recipientEmail) {
      Alert.alert("Error", "Recipient information is missing.");
      navigation.goBack();
      return;
    }

    if (user) {
      const messagesQuery = query(
        collection(FIREBASE_FIRESTORE, 'messages'),
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
      });

      navigation.setOptions({
        headerTitle: `Chat with ${recipientEmail}`,
      });

      return unsubscribe;
    }
  }, [navigation, user, recipientId, recipientEmail]);

  const sendMessage = async () => {
    if (message.trim() && user) {
      try {
        await addDoc(collection(FIREBASE_FIRESTORE, 'messages'), {
          text: message,
          createdAt: serverTimestamp(),
          userId: user.uid,
          userEmail: user.email,
          recipientId: recipientId,
          recipientEmail: recipientEmail,
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    } else {
      console.error('No authenticated user or message is empty');
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
