import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const CreatePost = ({ navigation }: RouterProps) => {
    const [caption, setCaption] = useState('');
    const user = FIREBASE_AUTH.currentUser;

    const handlePost = async () => {
        if (user && caption.trim()) {
            try {
                await setDoc(doc(FIREBASE_FIRESTORE, 'posts', `${user.uid}_${Date.now()}`), {
                    userId: user.uid,
                    caption,
                    createdAt: new Date(),
                });
                setCaption('');
                navigation.goBack();
            } catch (error) {
                console.error('Error creating post: ', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a New Post</Text>
            <TextInput
                style={styles.input}
                placeholder="Write a caption..."
                value={caption}
                onChangeText={setCaption}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handlePost}>
                <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 150,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#72bcd4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CreatePost;
