import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { FIREBASE_FIRESTORE } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<{ params: { userId: string } }, 'params'>;
}

const ProfileSummary = ({ navigation, route }: RouterProps) => {
  const { userId } = route.params;
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(FIREBASE_FIRESTORE, 'profiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Ensure no duplication of profileImage in gridImages
  const gridImages = [profile.profileImage, ...profile.gridImages].filter((image, index, self) => image && self.indexOf(image) === index);
  const gridData = gridImages.slice(0, 6);
  while (gridData.length < 6) {
    gridData.push(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {gridData.map((imageUri, index) => (
          <View key={index} style={styles.gridItem}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.gridImage} />
            ) : (
              <View style={styles.gridPlaceholder} />
            )}
          </View>
        ))}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{profile.profileName}</Text>
        <Text style={styles.age}>Age: {profile.age}</Text>
        {profile.aboutMe && <Text style={styles.aboutMe}>{profile.aboutMe}</Text>}
      </View>
    </View>
  );
};

const { height } = Dimensions.get('window');
const gridHeight = height * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gridContainer: {
    width: '100%',
    height: gridHeight,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  gridItem: {
    width: '45%',
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
    backgroundColor: '#e0e0e0',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 18,
    marginTop: 5,
  },
  aboutMe: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default ProfileSummary;
