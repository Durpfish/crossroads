import {View, Text, Button} from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../../firebaseConfig'

interface RouterProps {
    navigation: NavigationProp<any,any>;
}

const Home = ({navigation}: RouterProps) => {
    return (
        <View>
            <Text>Welcome to CrossRoads</Text>
            <Button onPress = {() => navigation.navigate('Next Page')} title="Cross Paths, Start Sparks" />
            <Button onPress = {() => FIREBASE_AUTH.signOut()} title="Logout" />
        </View>
    )
}

export default Home